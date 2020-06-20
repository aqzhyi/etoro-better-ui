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
import { PortfolioHeaderExtraButtons } from '@/components/Portfolio/PortfolioHeaderExtraButtons'
import { initializeIcons } from '@fluentui/react'
import { renderFooterUnitValues } from '@/components/Footer/FooterUnitValues'
import { PortfolioHistoryHeaderExtraButtons } from '@/components/Portfolio/PortfolioHistoryHeaderExtraButtons'
import { fetchExtraCurrency } from '@/actions/fetchExtraCurrency'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

type $ = JQueryStatic
globalThis.localStorage.setItem('debug', `${debugAPI.log.namespace}:*`)

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
const unbindConstructTriggerDelegate = emitter.on(
  Events.ready,
  function constructTriggerDelegate() {
    $('body').undelegate('.main-app-view', 'mouseover')

    initializeIcons()

    // Sidebar 不常因換頁而導致 UI 消失，因此可配置較長的觸發時間(throttle)
    $('body').delegate(
      `[automation-id="menu-layout"]`,
      'mouseover',
      throttle(() => {
        emitter.emit(Events.onSidebarHover)
      }, 30000),
    )

    // A按鈕大多屬換頁性質，使A按鈕切換後，盡可能快地將「本腳本UI」掛載至 etoro 頁面
    $('body').delegate('a[href], a[ng-click]', 'click', () => {
      globalThis.setTimeout(() => {
        if (globalThis.location.pathname.includes('watchlists')) {
          emitter.emit(Events.onWatchlistPageHover)
        } else if (globalThis.location.pathname.includes('portfolio/history')) {
          emitter.emit(Events.onPortfolioHistoryPageHover)
        } else if (globalThis.location.pathname.includes('portfolio')) {
          emitter.emit(Events.onPortfolioPageHover)
        }
      }, 500)
    })

    // 避免「本腳本UI」被 etoro 重新 render 而消失，配置較短的再觸發時間(throttle)
    $('body').delegate(
      '.main-app-view',
      'mouseover',
      throttle(event => {
        if (globalThis.location.pathname.includes('watchlists')) {
          emitter.emit(Events.onWatchlistPageHover)
        } else if (globalThis.location.pathname.includes('portfolio/history')) {
          emitter.emit(Events.onPortfolioHistoryPageHover)
        } else if (globalThis.location.pathname.includes('portfolio')) {
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

    $('body').delegate(
      '.more-info-button',
      'mouseover',
      throttle(() => {
        emitter.emit(Events.onMoreInfoButtonHover)
      }, 50),
    )

    unbindConstructTriggerDelegate()
  },
)

/**
 * 這使用戶不需要按巨集，直接按內建槓桿時，也會記憶
 */
const rememberRiskItemlevelAsLastUnbind = emitter.on(
  Events.ready,
  function rememberRiskItemlevelAsLast() {
    $('body').delegate('.risk-itemlevel', 'click', (index, element) => {
      const leverText = (index.target as HTMLAnchorElement).innerText
        .trim()
        .replace(/x/i, '')

      const state = store.getState()

      if (state.settings.betterEtoroUIConfig.executionUseApplyLast) {
        store.dispatch(
          setBetterEtoroUIConfig({
            executionLeverLast: Number(leverText),
          }),
        )
      }
    })

    rememberRiskItemlevelAsLastUnbind()
  },
)

/**
 * 查看更多按鈕
 */
emitter.on(Events.onMoreInfoButtonHover, function autoTriggerMore() {
  $('.more-info-button').click()
})

/**
 * 我的歷史記錄
 */
emitter.on(
  Events.onPortfolioHistoryPageHover,
  function constructPortfolioHistoryPage() {
    PortfolioHistoryHeaderExtraButtons.construct()
  },
)

/**
 * 我的關注列表
 */
emitter.on(Events.onWatchlistPageHover, watchlistHeaderConstructor)

/**
 * 我的投資組合
 */
emitter.on(
  Events.onPortfolioPageHover,
  function constructPortfolioHeaderExtra() {
    PortfolioHeaderExtraButtons.render()
  },
)

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
const unbindWelcomeMessage = emitter.on(
  Events.ready,
  function welcomeMessage() {
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
      { position: 'bottom-left', hideAfter: 3 },
    )

    const bootstrapEndedAt = new Date()
    const bootstrapUsedTime =
      bootstrapEndedAt.getTime() - bootstrapStartAt.getTime()
    debugAPI.log.extend('log')(`起動時間 = ${bootstrapUsedTime}ms`)
    unbindWelcomeMessage()
  },
)

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
  const state = store.getState()

  if (target.length) {
    target.html(
      i18n.左下入金按鈕(
        state.settings.exchange[state.settings.exchange.selected].sell,
      ),
    )
  }
}
emitter.on(Events.onSidebarHover, constructDepositButton)
emitter.on(Events.settingChange, constructDepositButton)

/**
 * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
 */
emitter.on(Events.settingChange, renderFooterUnitValues)
const constructFooterUnitValuesUnbind = emitter.on(
  Events.ready,
  function constructFooterUnitValues() {
    globalThis.setInterval(renderFooterUnitValues, 5000)
    constructFooterUnitValuesUnbind()
  },
)

/**
 * 左側欄連結項目與設定
 */
emitter.on(Events.settingChange, sidebarConstructor)
emitter.on(Events.onSidebarHover, sidebarConstructor)

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
   * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
   */
  GM.addStyle(`
    .footer-unit[_ngcontent-qlo-c4] {
      height: 100px;
    }

    .footer-unit-value-exchange {
      font-size: 10pt;
      margin-left: 4px;
      opacity: 0.65;
    }

    .footer-unit-value-exchange-main {
      font-weight: bold;
    }

    .footer-unit-value-exchange-small {
      font-size: 8pt;
    }
  `)

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

  /**
   * blueprintjs 的 tooltip 之 z-index 需要高於「下單 dialog」才好正確提示資訊
   */
  GM.addStyle(`
    .bp3-transition-container {
      z-index: 10001
    }
  `)

  /**
   * 關注的使用者們的餘額
   */
  GM.addStyle(`
    .user-meta {
      margin-right: 8px;
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

  constructCssUnbind()
})
