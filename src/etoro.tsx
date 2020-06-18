import '@blueprintjs/core/lib/css/blueprint.css'
import ExecutionDialog from './components/ExecutionDialog'
import { debugAPI } from './debugAPI'
import { emitter, Events } from './emitter'
import { exchange, getMYR, getNTD } from './exchange'
import { GM } from './GM'
import { storage } from './storage'
import { toCurrency } from './toCurrency'
import { sidebarConstructor } from '@/components/Sidebar/sidebarConstructor'
import { watchlistHeaderConstructor } from '@/components/WatchlistHeader/WatchlistHeader'
import { WatchlistUserControls } from '@/components/WatchlistUserControls/WatchlistUserControls'
import { i18n } from '@/i18n'
import store from '@/store/_store'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// import { initializeIcons } from '@uifabric/icons'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', `${debugAPI.log.namespace}:*`)

/** 介面更新頻率 */
const exchangeInterval = 5000

/** 計算啟動時間 */
const bootstrapStartAt = new Date()

/**
 * 開始運作腳本的時機點是在 etoro 頁面有出現的情況，
 * 因為才能夠開始將「本腳本」部件透過 jQuery 掛載上去
 */
$('body').delegate(
  '.main-app-view',
  'mouseover',
  throttle(() => {
    debugAPI.log.extend('log')('頁面加載完成')
    $('body').undelegate('.main-app-view', 'mouseover')
    emitter.emit(Events.ready)
  }, 1000),
)

/**
 * 以事件驅動分別在各頁面中，渲染「本腳本」的各個部件到 etoro 頁面上
 *
 * 然而，「本腳本」介面會因 etoro 換頁而導致消失
 *
 * 因此嘗試以低開銷的方式，不斷地（或使用戶感覺不出來）觸發介面渲染是必要的
 */
emitter.on(Events.ready, function constructTriggerDelegate() {
  // initializeIcons()

  // Sidebar 不常因換頁而導致 UI 消失，因此可配置較長的觸發時間(throttle)
  $('body').delegate(
    `[automation-id="menu-layout"]`,
    'mouseover',
    throttle(() => {
      emitter.emit(Events.onSidebarHover)
    }, 30000),
  )

  // 內頁常因換頁而導致 UI 消失，因此配置較短的觸發時間(throttle)
  $('body').delegate(
    '.main-app-view',
    'mouseover',
    throttle(event => {
      if (globalThis.location.pathname.includes('watchlists')) {
        emitter.emit(Events.onWatchlistPageHover)
      }
      if (globalThis.location.pathname.includes('portfolio')) {
        emitter.emit(Events.onPortfolioPageHover)
      }
    }, 5000),
  )

  // 彈出視窗畫面，此框用於下單，為實現加速下單的設計本意，使用較短的觸發時間(throttle)
  $('body').delegate(
    '.execution-main',
    'mouseover',
    throttle(event => {
      emitter.emit(Events.onDialogHover)
    }, 1000),
  )
})

/**
 * 我的關注列表
 */
emitter.on(Events.onWatchlistPageHover, watchlistHeaderConstructor)

/**
 * 下單框框增強介面
 */
emitter.on(Events.onDialogHover, function constructDialogMacro() {
  if (!storage.findConfig().executionMacroEnabled) {
    return
  }

  if (ExecutionDialog.isConstructed) {
    return
  }

  if (ExecutionDialog.isParentConstructed && !ExecutionDialog.isConstructed) {
    ExecutionDialog.construct()
    return
  }
})

/**
 * 歡迎訊息
 */
emitter.on(Events.ready, function welcomeMessage() {
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
    { position: 'top-center', hideAfter: 5 },
  )

  const bootstrapEndedAt = new Date()
  const bootstrapUsedTime =
    bootstrapEndedAt.getTime() - bootstrapStartAt.getTime()
  debugAPI.log.extend('log')(`起動時間 = ${bootstrapUsedTime}ms`)
})

/**
 * 關注的使用者們的餘額
 */
GM.addStyle(`
  .user-meta {
    margin-right: 8px;
  }
`)
emitter.on(Events.onWatchlistPageHover, async function constructPeopleExtra() {
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
      $(element).find('[automation-id="trade-item-avatar"]').attr('src') || '',
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
})

/**
 * 提供左側欄入金按鈕，匯率換算結果顯示
 */
const constructDepositButton = async () => {
  const target = $('.w-menu-footer .e-btn-big-2')

  if (target.length) {
    target.html(
      `入金（${
        exchange[storage.findConfig().selectedExchange].sell
      } 銀行賣出）`,
    )
  }
}
emitter.on(Events.onSidebarHover, constructDepositButton)
emitter.on(Events.settingChange, constructDepositButton)

/**
 * 提供價值的匯率
 */
emitter.on(Events.ready, function constructFooterUnitValueCSS() {
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
emitter.on(Events.settingChange, function constructFooterUnitValue() {
  const log = debugAPI.log.extend(
    `提供價值的匯率（每 ${exchangeInterval / 1000} 秒）`,
  )

  provideNTD()
  globalThis.setInterval(provideNTD, exchangeInterval)

  function provideNTD() {
    log('處理中...')
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
  }
})

/**
 * 左側欄連結項目與設定
 */
emitter.on(Events.settingChange, sidebarConstructor)
emitter.on(Events.onSidebarHover, sidebarConstructor)

/**
 * 取得匯率
 */
emitter.on(Events.ready, async function getExtraCurrencySettings() {
  await Promise.all([getNTD(), getMYR()]).then(gets => {
    const ntd = gets[0]
    const myr = gets[1]

    exchange.NTD = ntd
    exchange.MYR = myr

    emitter.emit(Events.settingChange)
  })
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
