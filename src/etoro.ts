import { debugAPI } from './debugAPI'
import { GM } from './GM'
import Emittery from 'emittery'

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
