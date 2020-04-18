import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { debugAPI } from './debugAPI'
import { GM } from './GM'
import { stringifyUrl } from 'query-string'
import { emitter, EmitterEvents } from './emitter'
import { getNTD, getMYR, exchange } from './exchange'
import { localStorage } from './localStorage'
import { toCurrency } from './toCurrency'
import toast from 'cogo-toast'
import ExecutionDialog from './components/ExecutionDialog'
import '@blueprintjs/core/lib/css/blueprint.css'

interface $ extends JQueryStatic {}
globalThis.localStorage.setItem('debug', '*')

/** 介面更新頻率 */
const exchangeInterval = 5000

enum Selector {
  setupExchanage = `github-com-hilezir-set-exchanage`,
  exchanageField = `github-com-hilezir-exchanage-display`,
  sidebar = `github-com-hilezir-sidebar`,
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
 * 載入跳出框框增強介面的時機點
 *
 * .trade-button-title                            // e.g. https://www.etoro.com/watchlists 的「買」「賣」按鈕
 * [automation-id="buy-sell-button-rate-value"]   // e.g. https://www.etoro.com/watchlists 的買或賣的價格「7088.30」按鈕
 * [automation-id="trade-button"]                 // e.g. https://www.etoro.com/markets/spx500 的「交易」大藍色按鈕
 *
 * （目前無法運作，原因暫不明）
 * .etoro-trade-button                            // e.g. https://www.etoro.com/portfolio/btc 的「買 7088.30」「賣 7088.30」按鈕
 */
emitter.on(EmitterEvents.ready, () => {
  ExecutionDialog.log(`安排好按鈕`)

  $('body').delegate(
    `
      .trade-button-title
      , [automation-id="buy-sell-button-rate-value"]
      , [automation-id="trade-button"]
      , .etoro-trade-button
    `,
    'click',
    () => {
      if (!localStorage.getExecutionMacroEnabled()) {
        ExecutionDialog.log(`功能未開啟`)
        return
      }

      ExecutionDialog.log(`開始偵測`)

      const watchId = globalThis.setInterval(() => {
        ExecutionDialog.log('偵測中...', ExecutionDialog)

        if (
          ExecutionDialog.isParentConstructed &&
          !ExecutionDialog.isConstructed
        ) {
          ExecutionDialog.construct()
        }

        if (ExecutionDialog.isConstructed) {
          globalThis.clearInterval(watchId)
          ExecutionDialog.log(`結束偵測`)
        }
      }, 250)
    },
  )
})

/**
 * 歡迎訊息
 */
emitter.on(EmitterEvents.ready, () => {
  toast.success(
    <React.Fragment>
      <span>🙏 感謝您使用 better etoro UI for Taiwan 更多資訊請恰詢：</span>
      <a
        style={{
          color: 'blue',
        }}
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        target='_blank'
      >
        better-etoro-ui 工具官方網站
      </a>
    </React.Fragment>,
    { position: 'top-right', hideAfter: 5 },
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
      font-size: 12pt;
      margin-left: 4px;
    }

    .footer-unit-value-exchange-main {
      font-weight: bold;
    }

    .footer-unit-value-exchange-small {
      font-size: 8pt;
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

        const currencyValue = USD * exchange[exchange.selected].buy
        const displayCurrency =
          exchange.selected === 'MYR'
            ? toCurrency(currencyValue)
            : toCurrency(Math.ceil(currencyValue))

        if (displayCurrency[1]) {
          twdBox.html(
            `${exchange.selected} <span class="footer-unit-value-exchange-main">${displayCurrency[0]}</span>.<span class="footer-unit-value-exchange-small">${displayCurrency[1]}</span>`,
          )
        } else {
          twdBox.html(
            `${exchange.selected} <span class="footer-unit-value-exchange-main">${displayCurrency[0]}</span>`,
          )
        }
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
const Sidebar = () => {
  const [enabled, setEnabled] = React.useState(
    localStorage.getExecutionMacroEnabled(),
  )

  return (
    <React.Fragment>
      <div className='i-menu-sep'>新台幣＆馬幣增強腳本</div>
      <a
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
      >
        <span className='i-menu-icon sprite news'></span>腳本官網
      </a>
      <a
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2'
      >
        <span className='i-menu-icon sprite help'></span>聯絡作者
      </a>
      <span id={Selector.setupExchanage} className='i-menu-link pointer'>
        <span className='i-menu-icon sprite settings'></span>設定幣別（當前：
        <span className={Selector.exchanageField}>{exchange.selected}</span>）
      </span>
      <span
        onClick={() => {
          localStorage.setExecutionMacroEnabled(!enabled)
          setEnabled(!enabled)
        }}
        className='i-menu-link pointer'
      >
        <span className='i-menu-icon sprite settings'></span>下單巨集（當前：
        <span className={Selector.exchanageField}>
          {enabled ? '啟用' : '停用'}
        </span>
        ）
      </span>
    </React.Fragment>
  )
}

emitter.on(EmitterEvents.ready, () => {
  debugAPI.log('安排側邊欄')

  $('.w-menu-main').append(`
    <div id="${Selector.sidebar}"></div>
  `)

  ReactDOM.render(
    <Sidebar />,
    globalThis.document.querySelector(`#${Selector.sidebar}`),
  )

  emitter.emit(EmitterEvents.sidebarButtonsArranged)
})

/**
 * 匯兌選擇器
 */
emitter.on(EmitterEvents.sidebarButtonsArranged, async () => {
  exchange.NTD.buy = (await getNTD())?.buy || 1
  exchange.NTD.sell = (await getNTD())?.sell || 1
  emitter.emit(EmitterEvents.exchangeChanged)

  $(`#${Selector.setupExchanage}`).on('click', async () => {
    const loading = toast.loading('設定變更中...')

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
      localStorage.setSelectedExchange(selectedExchange)
      $(`.${Selector.exchanageField}`).html(selectedExchange)
      emitter.emit(EmitterEvents.exchangeChanged)
      toast.success(`設定已變更，當前：${exchange.selected}`)
    } else {
      toast.info(`設定沒有變更，當前：${exchange.selected}`)
    }

    loading.hide?.()
  })
})

/**
 * 確保 toast 不會被蓋住
 */
GM.addStyle(`
  #ct-container {
    z-index: 1000000
  }
`)
