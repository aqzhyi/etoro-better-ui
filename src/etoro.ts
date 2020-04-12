import { debugAPI } from './debugAPI'

console.info(
  '🙏 感謝您使用 better etoro UI for Taiwan 更多資訊請恰 https://www.notion.so/hilezi/etoro-tampermonkey-4fe69cd704434ff1b82f0cd48dd219c3',
)

interface $ extends JQueryStatic {}
globalThis.localStorage.setItem('debug', '*')

/** 預估 etoro 完全載入時間 */
const loadedETA = 17500
const loadedInterval = 5000
const USDTWD = 30

/**
 * see https://www.tampermonkey.net/documentation.php GM_xmlhttpRequest(details)
 */
const tmAjax = (detail: { method: 'GET'; url: string }) => {
  type SuccessEvent = {
    status: number
    statusText: string
    responseText: string
  }
  return new Promise<SuccessEvent>((resolve, reject) => {
    globalThis['GM_xmlhttpRequest']({
      ...detail,
      onload: (event: SuccessEvent) => {
        resolve(event)
      },
      onerror: error => {
        reject(error)
      },
    })
  })
}

/**
 * 提供新台幣入金匯率
 */
globalThis.setTimeout(async () => {
  const log = debugAPI.tampermonkey.extend(`提供新台幣入金匯率`)

  const htmlText = await tmAjax({
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
}, loadedETA)

/**
 * 提供新台幣價值匯率價值顯示
 */
globalThis['GM_addStyle'](`
  .footer-unit[_ngcontent-qlo-c4] {
    height: 100px;
  }

  .footer-unit-value-TWD {
    font-size: 10pt;
    margin-left: 4px;
  }
`)
;(async () => {
  const log = debugAPI.tampermonkey.extend(
    `提供台灣銀行新台幣即期買入價值（每 ${loadedInterval / 1000} 秒）`,
  )

  const htmlText = await tmAjax({
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

  globalThis.setTimeout(() => {
    provideNTD()
    globalThis.setInterval(provideNTD, loadedInterval)
  }, loadedETA)

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
})()

/**
 * 修正「添加到列表」被其它元素蓋住的問題
 *
 * e.g. https://www.etoro.com/people/olivierdanvel/portfolio
 */
globalThis['GM_addStyle'](`
  body .inner-header {
    z-index: 1
  }
`)
