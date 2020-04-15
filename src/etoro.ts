import { debugAPI } from './debugAPI'
import { GM } from './GM'
import Emittery from 'emittery'
import { stringifyUrl } from 'query-string'

const emitter = new Emittery()
enum EmitterEvents {
  ready = 'ready',
  sidebarButtonsArranged = 'sidebarButtonsArranged',
  exchangeChanged = 'exchangeChanged',
}

interface $ extends JQueryStatic {}
globalThis.localStorage.setItem('debug', '*')

const storage = {
  getSelectedExchange: () =>
    (globalThis.localStorage.getItem('selected_exchange') ||
      'NTD') as typeof exchange['selected'],
  setSelectedExchange: (value: typeof exchange['selected']) =>
    globalThis.localStorage.setItem('selected_exchange', value),
}

/** 介面更新頻率 */
const exchangeInterval = 5000

type ExchangeType = {
  buy: number
  sell: number
}

/** 匯率幣別選擇 */
const exchange: {
  selected: 'NTD' | 'MYR'
  NTD: ExchangeType
  MYR: ExchangeType
} = {
  selected: storage.getSelectedExchange(),
  NTD: {
    sell: 30,
    buy: 30,
  },
  MYR: {
    sell: 4.25,
    buy: 4.25,
  },
}

enum Selector {
  setupExchanage = `github-com-hilezir-set-exchanage`,
}

/**
 * 載入腳本的時機點
 */
const readyIntervalId = globalThis.setInterval(async () => {
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
  const log = debugAPI.log.extend('關注的使用者們的餘額')

  GM.addStyle(`
    .user-meta {
      margin: 0 8px;
      font-size: 10pt;
      background: #ffcf76;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      width: 96px;
    }
  `)

  const updater = () => {
    log('安排好按鈕')

    $('et-user-row').each((index, element) => {
      const userFinder = $(element)
      const hasAppended = !!userFinder.find('.user-meta').length

      if (hasAppended) {
        return
      }

      /**
       * tests https://regexr.com/52ft5
       *
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726/3.jpg
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726.jpg
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/6441059/21.jpg
       */
      const cid = /avatars\/[\d]+[xX][\d]+\/(?<cid>[\d]+)\/?/.exec(
        $(element).find('[automation-id="trade-item-avatar"]').attr('src') ||
          '',
      )?.groups?.cid

      if (cid && !hasAppended) {
        userFinder.prepend($(`<button class="user-meta">餘額</button>`))

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
 * 提供入金匯率
 */
emitter.on(EmitterEvents.exchangeChanged, async () => {
  const log = debugAPI.log.extend(`提供入金匯率`)

  const target = $('.w-menu-footer .e-btn-big-2')

  if (target.length) {
    target.html(`入金（${exchange[exchange.selected].sell} 銀行賣出）`)
    log('成功')
  } else {
    log('失敗，找不到元素')
  }
})

/**
 * 提供價值的匯率
 */
emitter.on(EmitterEvents.ready, () => {
  GM.addStyle(`
    .footer-unit[_ngcontent-qlo-c4] {
      height: 100px;
    }

    .footer-unit-value-exchange {
      font-size: 10pt;
      margin-left: 4px;
    }
  `)
})
emitter.on(EmitterEvents.exchangeChanged, async () => {
  const log = debugAPI.log.extend(
    `提供價值的匯率（每 ${exchangeInterval / 1000} 秒）`,
  )

  provideNTD()
  globalThis.setInterval(provideNTD, exchangeInterval)

  async function provideNTD() {
    const unitValues = Array.from(
      document.querySelectorAll('.footer-unit-value'),
    )

    unitValues.forEach(element => {
      let twdBox: JQuery<HTMLSpanElement>

      twdBox = $(element)
        .parent()
        .find('.footer-unit-value-exchange') as JQuery<HTMLSpanElement>

      if (!twdBox.length) {
        $(element)
          .prepend()
          .append(`<span class='footer-unit-value-exchange'></span>`)
      }

      twdBox = $(element)
        .parent()
        .find('.footer-unit-value-exchange') as JQuery<HTMLSpanElement>

      if (twdBox.length) {
        const USD = Number(
          /\$(?<USD>[\d,.]+)?/
            .exec(element.innerHTML)
            ?.groups?.USD.replace(/,/g, '') || 0,
        )

        twdBox.html(
          `${exchange.selected} ${Math.ceil(
            USD * exchange[exchange.selected].buy,
          )}`,
        )
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

/**
 * 安排側邊欄
 */
emitter.on(EmitterEvents.ready, () => {
  debugAPI.log('安排側邊欄')
  $('.w-menu-main').append(`
    <div class="i-menu-sep">新台幣增強腳本</div>
  `).append(`
    <a class="i-menu-link pointer" target="_blank" href="https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3"><span class="i-menu-icon sprite news"></span>腳本官網</a>
    <a class="i-menu-link pointer" target="_blank" href="https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2"><span class="i-menu-icon sprite help"></span>聯絡作者</a>
    <span id='${Selector.setupExchanage}' class="i-menu-link pointer"><span class="i-menu-icon sprite settings"></span>設定幣別</span>
  `)

  emitter.emit(EmitterEvents.sidebarButtonsArranged)
})

const getMYR = async (): Promise<ExchangeType> => {
  try {
    const MyrFinder = await GM.ajax({
      method: 'GET',
      url: `https://www.pbebank.com/rates/forex.html?id=${new Date()}`,
    }).then(event => $(`<div>${event.responseText}</div>`))

    return {
      buy: Number(MyrFinder.find('tbody .optional').eq(0).html()),
      sell: Number(MyrFinder.find('tbody .essential').eq(1).html()),
    }
  } catch (error) {
    debugAPI.log.extend('大眾銀行馬幣錯誤')(error)

    return {
      buy: 1,
      sell: 1,
    }
  }
}

const getNTD = async (): Promise<ExchangeType> => {
  const htmlText = await GM.ajax({
    method: 'GET',
    url: 'https://rate.bot.com.tw/xrt?Lang=zh-TW',
  })
    .then(event => event.responseText)
    .catch(() => ``)

  const sell = Number(
    /<td data-table="本行即期賣出" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || 1,
  )

  const buy = Number(
    /<td data-table="本行即期買入" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || 1,
  )

  return { buy, sell }
}

/**
 * 匯兌選擇器
 */
emitter.on(EmitterEvents.sidebarButtonsArranged, async () => {
  const log = debugAPI.log.extend('匯兌選擇器')
  exchange.NTD.buy = (await getNTD())?.buy || 1
  exchange.NTD.sell = (await getNTD())?.sell || 1
  emitter.emit(EmitterEvents.exchangeChanged)

  $(`#${Selector.setupExchanage}`).on('click', async () => {
    const selectedExchange = prompt(
      '請輸入你要選擇的幣別：「NTD」或「MYR」',
      'NTD',
    ) as typeof exchange['selected']

    if (selectedExchange && ['NTD', 'MYR'].includes(selectedExchange)) {
      if (selectedExchange === 'NTD') {
        exchange.NTD.buy = (await getNTD())?.buy || 1
        exchange.NTD.sell = (await getNTD())?.sell || 1
      }

      if (selectedExchange === 'MYR') {
        exchange.MYR.buy = (await getMYR())?.buy || 1
        exchange.MYR.sell = (await getMYR())?.sell || 1
      }

      exchange.selected = selectedExchange
      storage.setSelectedExchange(selectedExchange)
      emitter.emit(EmitterEvents.exchangeChanged)
      log(`已變更`, exchange)
    } else {
      log(`沒有變更`, exchange)
    }
  })
})
