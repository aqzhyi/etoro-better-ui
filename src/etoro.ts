import { debugAPI } from './debugAPI'
import { GM } from './GM'
import Emittery from 'emittery'
import { stringifyUrl } from 'query-string'

const emitter = new Emittery()
enum EmitterEvents {
  ready = 'ready',
}

interface $ extends JQueryStatic {}
globalThis.localStorage.setItem('debug', '*')

/** 介面更新頻率 */
const loadedInterval = 5000
/** 預設的 USD 兌 TWD。若允許外界資源，則此值依不具作用。 */
const USDTWD = 30

/**
 * 載入腳本的時機點
 */
const readyIntervalId = globalThis.setInterval(() => {
  if ($('.w-menu-footer .e-btn-big-2').length > 0) {
    globalThis.clearInterval(readyIntervalId)
    emitter.emit(EmitterEvents.ready)
  }
}, 100)

/**
 * 歡迎訊息
 */
emitter.on(EmitterEvents.ready, () => {
  console.info(
    '🙏 感謝您使用 better etoro UI for Taiwan 更多資訊請恰 https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3',
  )
})

/**
 * 關注的使用者們的餘額
 */
emitter.on(EmitterEvents.ready, async () => {
  const log = debugAPI.tampermonkey.extend('關注的使用者們的餘額')

  GM.addStyle(`
    .user-meta {
      margin: 0 8px;
      font-size: 10pt;
      background: #ffebc6;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
  `)

  const updater = () => {
    $('et-user-row').each((index, element) => {
      const userFinder = $(element)
      const hasAppended = !!userFinder.find('.user-meta').length

      if (hasAppended) {
        return
      }

      log('開始處理')

      const cidFinder = userFinder.find('[automation-id="trade-item-avatar"]')
      /**
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726/3.jpg
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726.jpg
       */
      const cid = /avatars\/[\s\S]+\/(?<cid>[\d]+)\/?[\d]+.jpg/.exec(
        $(element).find('[automation-id="trade-item-avatar"]').attr('src') ||
          '',
      )?.groups?.cid

      if (!cid) {
        log('找不到 cid', cidFinder)
      }

      if (cid && !hasAppended) {
        $(`<button class="user-meta">餘額</button>`).appendTo(
          userFinder.find(
            '.row-wrap [automation-id="watchlist-item-list-user-wrapp-investors"]',
          ),
        )

        const button = userFinder.find('.user-meta')

        button.on('click', () => {
          const button = userFinder.find('.user-meta')
          button.html('讀取中')

          GM.ajax({
            method: 'GET',
            url: stringifyUrl({
              url:
                'https://www.etoro.com/sapi/trade-data-real/live/public/portfolios',
              query: {
                cid,
              },
            }),
          })
            .then(event => {
              const model = JSON.parse(
                /var model = (?<model>{[\s\S]+}),/i.exec(event.responseText)
                  ?.groups?.model || `{}`,
              ) as {
                /** 餘額 */
                CreditByRealizedEquity?: number
              }

              button.html(`餘額 ${model.CreditByRealizedEquity?.toFixed(2)}%`)
            })
            .finally(() => {
              log(`獲取 cid=${cid} 餘額`)
            })
        })
      }
    })
  }

  globalThis.setInterval(updater, 2500)
})

/**
 * 提供新台幣入金匯率
 */
emitter.on(EmitterEvents.ready, async () => {
  const log = debugAPI.tampermonkey.extend(`提供新台幣入金匯率`)

  const htmlText = await GM.ajax({
    method: 'GET',
    url: 'https://rate.bot.com.tw/xrt?Lang=zh-TW',
  })
    .then(event => event.responseText)
    .catch(() => ``)

  const TWD = Number(
    /<td data-table="本行即期賣出" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || USDTWD,
  )

  const target = $('.w-menu-footer .e-btn-big-2')

  if (target.length) {
    target.html(`入金（${TWD} 台銀即賣）`)
    log('成功')
  } else {
    log('失敗，找不到元素')
  }
})

/**
 * 提供新台幣價值匯率價值顯示
 */
emitter.on(EmitterEvents.ready, () => {
  GM.addStyle(`
    .footer-unit[_ngcontent-qlo-c4] {
      height: 100px;
    }

    .footer-unit-value-TWD {
      font-size: 10pt;
      margin-left: 4px;
    }
  `)
})
emitter.on(EmitterEvents.ready, async () => {
  const log = debugAPI.tampermonkey.extend(
    `提供台灣銀行新台幣即期買入價值（每 ${loadedInterval / 1000} 秒）`,
  )

  const htmlText = await GM.ajax({
    method: 'GET',
    url: 'https://rate.bot.com.tw/xrt?Lang=zh-TW',
  })
    .then(event => event.responseText)
    .catch(() => ``)

  const TWD = Number(
    /<td data-table="本行即期買入" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || USDTWD,
  )

  provideNTD()
  globalThis.setInterval(provideNTD, loadedInterval)

  async function provideNTD() {
    const unitValues = Array.from(
      document.querySelectorAll('.footer-unit-value'),
    )

    unitValues.forEach(element => {
      let twdBox: JQuery<HTMLSpanElement>

      twdBox = $(element).parent().find('.footer-unit-value-TWD') as JQuery<
        HTMLSpanElement
      >

      if (!twdBox.length) {
        $(element)
          .prepend()
          .append(`<span class='footer-unit-value-TWD'></span>`)
      }

      twdBox = $(element).parent().find('.footer-unit-value-TWD') as JQuery<
        HTMLSpanElement
      >

      if (twdBox.length) {
        const USD = Number(
          /\$(?<USD>[\d,.]+)?/
            .exec(element.innerHTML)
            ?.groups?.USD.replace(/,/g, '') || 0,
        )

        twdBox.html(`NTD ${Math.ceil(USD * TWD)}`)
      }
    })

    log('成功')
  }
})

/**
 * 修正「添加到列表」被其它元素蓋住的問題
 *
 * e.g. https://www.etoro.com/people/olivierdanvel/portfolio
 */
emitter.on(EmitterEvents.ready, () => {
  GM.addStyle(`
    body .inner-header {
      z-index: 1
    }
  `)
})

/**
 * 使「買入與賣出按鈕」更加立體明確
 *
 * 大多數使用者在看到買入與賣出時，時常分不清「目前勾選」項目，導致經常發生明明要買入，卻不小心賣空的狀況。
 */
emitter.on(EmitterEvents.ready, () => {
  GM.addStyle(`
    .execution-head .execution-head-button.active:after {
      content: "✅";
    }
  `)
})
