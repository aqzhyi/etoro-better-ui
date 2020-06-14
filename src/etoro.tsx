import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { debugAPI } from './debugAPI'
import { GM } from './GM'
import { stringifyUrl } from 'query-string'
import { emitter, Events } from './emitter'
import { getNTD, getMYR, exchange } from './exchange'
import { storage } from './storage'
import { toCurrency } from './toCurrency'
import toast from 'cogo-toast'
import ExecutionDialog from './components/ExecutionDialog'
import '@blueprintjs/core/lib/css/blueprint.css'
import Sidebar from '@/components/Sidebar/Sidebar'
import { Provider } from 'react-redux'
import store from '@/store/_store'
import { WatchlistUserControls } from '@/components/WatchlistUserControls/WatchlistUserControls'
import { i18n } from '@/i18n'
import { sidebarConstructor } from '@/components/Sidebar/sidebarConstructor'
import { watchlistHeaderConstructor } from '@/components/WatchlistHeader/WatchlistHeader'
// import { initializeIcons } from '@uifabric/icons'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', '*')

/** 介面更新頻率 */
const exchangeInterval = 5000

/**
 * 載入腳本的時機點
 */
const readyIntervalId = globalThis.setInterval(async () => {
  if ($('.w-menu-footer .e-btn-big-2').length > 0) {
    globalThis.clearInterval(readyIntervalId)
    emitter.emit(Events.ready)
  }
}, 100)

/**
 * 事件驅動
 */
emitter.on(Events.ready, () => {
  // initializeIcons()

  $('body').delegate(`[automation-id="menu-layout"]`, 'mouseover', () => {
    emitter.emit(Events.onSidebarHover)
  })

  $('body').delegate('.main-app-view', 'mouseover', () => {
    if (globalThis.location.pathname.includes('watchlists')) {
      emitter.emit(Events.onWatchlistPageHover)
    }
    if (globalThis.location.pathname.includes('portfolio')) {
      emitter.emit(Events.onPortfolioPageHover)
    }
  })
})

/**
 *
 */
emitter.on(Events.ready, watchlistHeaderConstructor)
emitter.on(Events.onWatchlistPageHover, watchlistHeaderConstructor)

/**
 * 載入跳出框框增強介面的時機點
 */
emitter.on(Events.ready, () => {
  ExecutionDialog.log(`安排好按鈕`)

  let watchId

  const construct = () => {
    ExecutionDialog.log('偵測中...', ExecutionDialog)

    if (ExecutionDialog.isParentConstructed && !ExecutionDialog.isConstructed) {
      ExecutionDialog.construct()
    }

    if (ExecutionDialog.isConstructed) {
      globalThis.clearInterval(watchId)
      ExecutionDialog.log(`結束偵測`)
    }
  }

  $('body').delegate(`.uidialog-content`, 'mouseover', () => {
    if (!storage.findConfig().executionMacroEnabled) {
      ExecutionDialog.log(`功能未開啟`)
      return
    }

    ExecutionDialog.log(`開始偵測`)

    globalThis.clearInterval(watchId)
    construct()
    watchId = globalThis.setInterval(construct, 250)
  })

  $('body').delegate(`.uidialog-content`, 'mouseout', () => {
    globalThis.setTimeout(() => {
      ExecutionDialog.log(`結束偵測`)
      globalThis.clearInterval(watchId)
    }, 300)
  })
})

/**
 * 歡迎訊息
 */
emitter.on(Events.ready, () => {
  toast.success(
    i18n.感謝使用提示語(() => (
      <a
        style={{
          color: 'blue',
        }}
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        target='_blank'
      >
        better-etoro-ui
      </a>
    )),
    { position: 'top-right', hideAfter: 5 },
  )
})

/**
 * 關注的使用者們的餘額
 */
emitter.on(Events.ready, async () => {
  const log = debugAPI.log.extend('關注的使用者們的餘額')

  GM.addStyle(`
    .user-meta {
      margin-right: 8px;
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

      const traderName = $(element)
        .find('[automation-id="trade-item-name"]')
        .html()

      if (cid && !hasAppended) {
        userFinder.prepend(
          $(`<span class="user-meta" id="user-meta-${cid}"></span>`),
        )

        ReactDOM.render(
          <Provider store={store}>
            <WatchlistUserControls cid={cid} traderName={traderName} />
          </Provider>,
          globalThis.document.querySelector(`#user-meta-${cid}`),
        )
      }
    })
  }

  globalThis.setInterval(updater, 2500)
})

/**
 * 提供左側欄入金按鈕，匯率換算結果顯示
 */
const constructDepositButton = async () => {
  const log = debugAPI.log.extend(`提供入金匯率`)

  const target = $('.w-menu-footer .e-btn-big-2')

  if (target.length) {
    target.html(
      `入金（${
        exchange[storage.findConfig().selectedExchange].sell
      } 銀行賣出）`,
    )
    log('成功')
  } else {
    log('失敗，找不到元素')
  }
}
emitter.on(Events.onSidebarHover, constructDepositButton)
emitter.on(Events.settingChange, constructDepositButton)

/**
 * 提供價值的匯率
 */
emitter.on(Events.ready, () => {
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
emitter.on(Events.settingChange, async () => {
  const log = debugAPI.log.extend(
    `提供價值的匯率（每 ${exchangeInterval / 1000} 秒）`,
  )

  provideNTD()
  globalThis.setInterval(provideNTD, exchangeInterval)

  async function provideNTD() {
    const exchangeSelected = storage.findConfig().selectedExchange

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

    log('成功')
  }
})

/**
 * 左側欄連結項目與設定
 */
emitter.on(Events.ready, sidebarConstructor)
emitter.on(Events.settingChange, sidebarConstructor)
emitter.on(Events.onSidebarHover, sidebarConstructor)

/**
 * 取得匯率
 */
Promise.all([getNTD(), getMYR()]).then(gets => {
  const ntd = gets[0]
  const myr = gets[1]

  exchange.NTD = ntd
  exchange.MYR = myr

  emitter.emit(Events.settingChange)
})

/**
 * 修正「添加到列表」被其它元素蓋住的問題
 *
 * e.g. https://www.etoro.com/people/olivierdanvel/portfolio
 */
GM.addStyle(`
  body .inner-header {
    z-index: 1
  }
`)

/**
 * 使「買入與賣出按鈕」更加立體明確
 *
 * 大多數使用者在看到買入與賣出時，時常分不清「目前勾選」項目，導致經常發生明明要買入，卻不小心賣空的狀況。
 */
GM.addStyle(`
  .execution-head .execution-head-button.active:after {
    content: "✅";
  }
`)

/**
 * 確保 toast 不會被蓋住
 */
GM.addStyle(`
  #ct-container {
    z-index: 1000000
  }
`)
