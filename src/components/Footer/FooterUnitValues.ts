import { debugAPI } from '@/debugAPI'
import { storage } from '@/storage'
import { exchange } from '@/exchange'
import { toCurrency } from '@/toCurrency'

export const renderFooterUnitValues = () => {
  const log = debugAPI.log.extend(`提供底部價值的匯率`)

  log('處理中...')
  const exchangeSelected = storage.findConfig().selectedExchange

  const unitValues = Array.from(
    document.querySelectorAll(
      `
        .footer-unit-value,
        [data-etoro-automation-id="detailed-view-header-details-profit-value"]
      `,
    ),
  )

  unitValues.forEach(element => {
    let twdBox: JQuery<HTMLSpanElement>

    twdBox = $(element).parent().find('.footer-unit-value-exchange') as JQuery<
      HTMLSpanElement
    >

    if (!twdBox.length) {
      $(element)
        .prepend()
        .append(`<span class='footer-unit-value-exchange'></span>`)
    }

    twdBox = $(element).parent().find('.footer-unit-value-exchange') as JQuery<
      HTMLSpanElement
    >

    if (twdBox.length) {
      const USD = Number(
        /\$(?<USD>[\d,.]+)?/
          .exec(element.innerHTML)
          ?.groups?.USD.replace(/,/g, '') || 0,
      )

      const currencyValue = USD * exchange[exchangeSelected].buy
      const displayCurrency =
        exchangeSelected === 'MYR'
          ? toCurrency(currencyValue)
          : toCurrency(Math.ceil(currencyValue))

      if (displayCurrency[1]) {
        twdBox.html(
          `${exchangeSelected} <span class="footer-unit-value-exchange-main">${displayCurrency[0]}</span>.<span class="footer-unit-value-exchange-small">${displayCurrency[1]}</span>`,
        )
      } else {
        twdBox.html(
          `${exchangeSelected} <span class="footer-unit-value-exchange-main">${displayCurrency[0]}</span>`,
        )
      }
    }
  })
}
