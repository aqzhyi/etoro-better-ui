import { debugAPI } from './debugAPI'
import { emitter, Events } from './emitter'
import { GM } from './GM'
import { fetchExtraCurrency } from '~/actions/fetchExtraCurrency'
import { renderSidebarDepositButton } from '~/components/SidebarDepositButton'
import { applyEventsObservers } from '~/etoroEventProbe'
import { showWelcomeMessage } from '~/components/UniversalWelcomeMessage'
import store from '~/store/_store'
import { cleanStickReactComponents } from '~/utils/cleanStickReactComponents'
import { renderStickReactComponents } from '~/utils/renderStickReactComponents'
import React from 'react'
import { registeredExecutionDialogStatusInfo } from '~/components/ExecutionDialog/ExecutionDialogStatusInfo'
import { gaAPI, GaEventId } from '~/gaAPI'
import packageJSON from '../package.json'
import {
  nativeEtoroAmountSaveToStorage,
  nativeEtoroLeverSaveToStorage,
} from '~/components/ExecutionDialog/applyRiskAndAmountSaveToMemory'
import '~/i18n'
import { angularAPI } from '~/angularAPI'
import pWaitFor from 'p-wait-for'
import { storage } from '~/storage'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', `${debugAPI.log.namespace}:*`)

debugAPI.universal('套件正在努力加載...')

/**
 * Bootstrap the better-etoro-ui when the angular scope is loaded
 */
pWaitFor(
  () =>
    !!globalThis.document.querySelector('.i-logo') &&
    !!angularAPI.$rootScope?.session.locale,
  { interval: 500 },
)
  .then(() => {
    debugAPI.universal('🟢套件啟動完成')
    emitter.emit(Events.ready)

    gaAPI.sendEvent(
      GaEventId.universal_bootstrapWithVersion,
      `version=${packageJSON.version}`,
    )
  })
  .catch(() => {
    debugAPI.universal('🔴套件啟動失敗')
  })

/**
 * 以事件驅動分別在各頁面中，渲染「本腳本」的各個部件到 etoro 頁面上
 *
 * 然而，「本腳本」介面會因 etoro 換頁而導致消失
 *
 * 因此嘗試以低開銷的方式，不斷地（或使用戶感覺不出來）觸發介面渲染是必要的
 */
emitter.once(Events.ready).then(applyEventsObservers)

/**
 * Google Analytics
 */
emitter.once(Events.ready).then(function initializeGa() {
  gaAPI.initialize()
})

/**
 * Make sure Extension UI re-renders ASAP
 *
 * angular route changes will remove containers (which is React-Components),
 * re-renders ASAP in order to provider better UX
 */
emitter.on(Events.onMountUIs, renderStickReactComponents)

/**
 * To avoid memory leak if angular removes React-Components containers
 */
emitter.on(Events.onUnmountUIs, cleanStickReactComponents)

/**
 * Auto confirms "I want to close all positions"
 */
emitter.on(
  Events.onCloseAllPositionsDialogHover,
  function allPositionsCloseAgree() {
    const button = $(
      '[data-etoro-automation-id="close-all-positions-selection-input"]',
    )

    if (button.hasClass('ng-empty')) {
      button.trigger('click')
    }
  },
)

/**
 * Execution-Dialog components
 */
emitter.on(Events.onDialogHover, registeredExecutionDialogStatusInfo.mount)
emitter.on(Events.onDialogNotFound, registeredExecutionDialogStatusInfo.unmount)

// Make execution dialog of native etoro functions able to and save values to localStorage
emitter.once(Events.ready).then(nativeEtoroLeverSaveToStorage)
emitter.once(Events.ready).then(nativeEtoroAmountSaveToStorage)

/**
 * Auto clicks "More Button"
 */
emitter.on(Events.onMoreInfoButtonHover, function triggerMoreButton() {
  $('.more-info-button').trigger('click')
  ;[500, 1000, 1500, 2000, 2500].forEach(value => {
    globalThis.setTimeout(() => {
      $('.more-info-button').trigger('click')
    }, value)
  })
})

/**
 * 歡迎訊息
 */
emitter.once(Events.ready).then(showWelcomeMessage)

/**
 * 提供左側欄入金按鈕，匯率換算結果顯示
 */
emitter.on(Events.settingChange, renderSidebarDepositButton)

/**
 * 取得外部銀行買賣匯率
 */
emitter.once(Events.ready).then(function _fetchExtraCurrency() {
  store.dispatch(fetchExtraCurrency())
})

// 盡可能不拖慢 etoro 程式啟動時間，將 CSS 統一在 ready 後加載
emitter.once(Events.ready).then(function constructCSS() {
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
    .execution-head .execution-head-button { opacity: 0.4; }
    .execution-head .execution-head-button.active { opacity: 1; }

    .execution-head .execution-head-button.active:after {
      content: "✅";
    }
  `)

  /**
   * 確保 toast 不會被蓋住
   *
   * @fluentui/react Dialog 的 z-index: 1000000，為避免被蓋掉，則 +1
   */
  GM.addStyle(`
    #ct-container {
      z-index: 1000001
    }

    #ct-container .ct-toast {
      box-shadow: 1px 1px 6px 1px black;
      transform: scale(0.9);
    }
  `)

  /**
   * 為關注列表頁面增加一點 style 質感
   */
  GM.addStyle(`
    et-instrument-trading-row:hover,
    et-user-row:hover {
      box-shadow: 1px 1px 5px #42424294;
      text-shadow: 2px 2px 1px #d2d2d2;
    }
  `)

  /** 使顯眼賣出或買入文字 */
  GM.addStyle(`
    [data-etoro-automation-id="open-trades-table-body-cell-action-sell"] {
      color: #ff7171;
    }
    [data-etoro-automation-id="open-trades-table-body-cell-action-sell"]:after {
      content: "📉";
    }

    [data-etoro-automation-id="open-trades-table-body-cell-action-buy"] {
      color: #20ae20;
    }
    [data-etoro-automation-id="open-trades-table-body-cell-action-buy"]:after {
      content: "📈";
    }
  `)
})

/** demo mode, should controls by setting of etoro-better-ui */
if (storage.findConfig().demoMode) {
  $('body').addClass('etoro-better-ui--demo-mode')
} else {
  $('body').removeClass('etoro-better-ui--demo-mode')
}

GM.addStyle(`
  body.etoro-better-ui--demo-mode #ExecutionDialogStatusInfo
  ,body.etoro-better-ui--demo-mode .i-menu-user-username
  ,body.etoro-better-ui--demo-mode .i-portfolio-table-hat-cell-value
  ,body.etoro-better-ui--demo-mode .trading-verified-line
  ,body.etoro-better-ui--demo-mode et-account-balance
  ,body.etoro-better-ui--demo-mode .i-sidebar-user-avatar
  ,body.etoro-better-ui--demo-mode et-deposit-billing-details > div
  ,body.etoro-better-ui--demo-mode .withdraw-amount
  {
    filter: blur(10px);
  }
`)
