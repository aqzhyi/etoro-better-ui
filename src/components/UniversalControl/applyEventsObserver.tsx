import { initializeIcons } from '@fluentui/react'
import { throttle } from 'lodash'
import { emitter, Events } from '@/emitter'
import { debugAPI } from '@/debugAPI'
import { angularAPI } from '@/angularAPI'

export function applyEventsObserver() {
  $('body').undelegate('.main-app-view', 'mouseover.bootstrap')

  initializeIcons()

  angularAPI.$rootScope.$watch(
    () => {
      return angularAPI.$rootScope.layoutCtrl.uiDialog.isDialogOpen
    },
    (newValue, oldValue) => {
      if (newValue !== oldValue && newValue === false) {
        emitter.emit(Events.onDialogNotFount)
      }
    },
  )

  // 「全部平倉」
  $('body').delegate(
    `[data-etoro-automation-id="close-all-positions-window"]`,
    'mouseover',
    throttle(() => {
      emitter.emit(Events.onCloseAllPositionsDialogHover)
    }, 1000),
  )

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
      if (angularAPI.$rootScope.layoutCtrl.uiDialog.isDialogOpen === true) {
        emitter.emit(Events.onDialogHover)
      }
    }, 500),
  )

  $('body').delegate(
    '.more-info-button',
    'mouseover',
    throttle(() => {
      emitter.emit(Events.onMoreInfoButtonHover)
    }, 50),
  )

  globalThis.setInterval(() => {
    emitter.emit(Events.onPing)
  }, 5000)

  debugAPI.universal('套件已做好準備')
}
