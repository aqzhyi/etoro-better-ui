import 'rc-tooltip/assets/bootstrap_white.css'
import { debugAPI } from './debugAPI'
import { emitter, Events } from './emitter'
import { GM } from './GM'
import { fetchExtraCurrency } from '@/actions/fetchExtraCurrency'
import { fetchStatusInfoAggregate } from '@/actions/fetchStatusInfoAggregate'
import { fetchPingValue } from '@/actions/setPingValue'
import { applyExecutionRiskLeverFromMemory } from '@/components/ExecutionDialog/applyExecutionRiskLeverFromMemory'
import {
  mountExecutionDialogControls,
  unmountExecutionDialogControls,
} from '@/components/ExecutionDialog/ExecutionDialogControls'
import {
  mountExecutionDialogStatusInfo,
  unmountExecutionDialogStatusInfo,
} from '@/components/ExecutionDialog/ExecutionDialogStatusInfo'
import { constructContainersForFooterUnitValues } from '@/components/Footer/constructContainersForFooterUnitValues'
import { mountPortfolioHeaderExtraButtons } from '@/components/Portfolio/PortfolioHeaderExtraButtons'
import { mountPortfolioHistoryHeaderExtraButtons } from '@/components/Portfolio/PortfolioHistoryHeaderExtraButtons'
import { renderSidebarDepositButton } from '@/components/Sidebar/SidebarDepositButton'
import { mountSidebarMenuItems } from '@/components/Sidebar/SidebarMenuItems'
import { applyEventsObserver as applyEventsObservers } from '@/components/UniversalControl/applyEventsObservers'
import { UniversalControlKeyObserver } from '@/components/UniversalControl/UniversalControlKeyObserver'
import { showWelcomeMessage } from '@/components/UniversalControl/UniversalWelcomeMessage'
import { mountWatchlistHeader } from '@/components/Watchlist/WatchlistHeader'
import { constructContainersForWatchlistPeople } from '@/components/Watchlist/WatchlistPeople'
import store from '@/store/_store'
import { cleanStickReactComponents } from '@/utils/cleanStickReactComponents'
import { renderStickReactComponents } from '@/utils/renderStickReactComponents'
import { throttle } from 'lodash'
import React from 'react'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', `${debugAPI.log.namespace}:*`)

debugAPI.universal('套件正在努力加載...')

/**
 * 開始運作腳本的時機點是在 etoro 頁面有出現的情況，
 * 因為才能夠開始將「本腳本」部件透過 jQuery 掛載上去
 */
$('body').delegate(
  '.main-app-view',
  'mouseover.bootstrap',
  throttle(() => {
    debugAPI.universal('套件加載完成')
    $('body').undelegate('.main-app-view', 'mouseover.bootstrap')
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
emitter.once(Events.ready).then(applyEventsObservers)

/**
 * Make sure Extension UI re-renders ASAP
 *
 * angular route changes will remove containers (which is React-Components),
 * re-renders ASAP in order to provider better UX
 */
emitter.on(Events.onMountUIs, renderStickReactComponents)

/**
 * Make sure React-Components works with UI that may rendered by dynamic data
 */
emitter.on(Events.onPing, constructContainersForFooterUnitValues)
emitter.on(Events.onMountUIs, constructContainersForFooterUnitValues)
emitter.on(Events.onMountUIs, constructContainersForWatchlistPeople)

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
      button.click()
    }
  },
)

/**
 * status checking
 */
emitter.on(Events.onPing, function checkSystemStatus() {
  debugAPI.universal('checking https://status.etoro.com')
  store.dispatch(fetchStatusInfoAggregate())

  debugAPI.universal('inferring delay')
  store.dispatch(fetchPingValue())
})

/**
 * 下單視窗的各種關鍵資訊提示 e.g. 延遲、可用餘額 etc.
 */
emitter.on(Events.onDialogHover, mountExecutionDialogStatusInfo)
emitter.on(Events.onDialogNotFount, unmountExecutionDialogStatusInfo)

/**
 * 掌握全網站的 keyboard 按下事件
 */
const constructKeyboardEventsUnbind = emitter.on(
  Events.ready,
  function constructKeyboardEvents() {
    UniversalControlKeyObserver.construct()
    constructKeyboardEventsUnbind()
  },
)

/**
 * 這使用戶不需要按巨集，直接按內建槓桿時，也會記憶
 */
emitter.once(Events.ready).then(applyExecutionRiskLeverFromMemory)

/**
 * Auto clicks "More Button"
 */
emitter.on(Events.onMoreInfoButtonHover, function triggerMoreButton() {
  $('.more-info-button').click()
  ;[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].forEach(
    value => {
      globalThis.setTimeout(() => {
        $('.more-info-button').click()
      }, value)
    },
  )
})

/**
 * 我的歷史記錄
 */
emitter.on(
  Events.onPortfolioHistoryPageHover,
  mountPortfolioHistoryHeaderExtraButtons,
)

/**
 * 我的關注列表
 */
emitter.on(Events.onWatchlistPageHover, mountWatchlistHeader)

/**
 * 我的投資組合
 */
emitter.on(Events.onPortfolioPageHover, mountPortfolioHeaderExtraButtons)

/**
 * 下單框框增強介面
 */
emitter.on(Events.onDialogHover, mountExecutionDialogControls)
emitter.on(Events.onDialogNotFount, unmountExecutionDialogControls)

/**
 * 歡迎訊息
 */
emitter.once(Events.ready).then(showWelcomeMessage)

/**
 * 提供左側欄入金按鈕，匯率換算結果顯示
 */
emitter.on(Events.settingChange, renderSidebarDepositButton)

/**
 * 左側欄連結項目與設定
 */
emitter.on(Events.settingChange, mountSidebarMenuItems)

/**
 * 取得外部銀行買賣匯率
 */
const fetchExtraCurrencySettingsUnbind = emitter.on(
  Events.ready,
  async function fetchExtraCurrencySettings() {
    await store.dispatch(fetchExtraCurrency())
    emitter.emit(Events.settingChange)
    fetchExtraCurrencySettingsUnbind()
  },
)

// 盡可能不拖慢 etoro 程式啟動時間，將 CSS 統一在 ready 後加載
const constructCssUnbind = emitter.on(Events.ready, function constructCSS() {
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
   *
   * @fluentui/react Dialog 的 z-index: 1000000，為避免被蓋掉，則 +1
   */
  GM.addStyle(`
    #ct-container {
      z-index: 1000001
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

  /** dialog z-index:10000, therefore must set tooltip to 10001 */
  GM.addStyle(`
    .rc-tooltip {
      z-index: 10001
    }
  `)

  constructCssUnbind()
})
