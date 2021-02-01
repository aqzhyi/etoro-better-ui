import { angularAPI } from '~/angularAPI'
import { registeredExecutionDialogStatusInfo } from '~/components/ExecutionDialog/ExecutionDialogStatusInfo'
import { debugAPI } from '~/debugAPI'
import { emitter, Events } from '~/emitter'
import { map, throttle } from 'lodash'
import store from '~/store/_store'
import { exectionDialogPrices } from '~/components/ExecutionDialog/ExecutionDialogPrices'
import { setGroupPositionIds } from '~/actions/setGroupPositionIds'
import { syncNativeTradeDialogOpen } from '~/actions/syncFromNativeTradeDialogOpenState'
import { toggleTradeDashboard } from '~/actions/toggleTradeDashboard'
import cogoToast from 'cogo-toast'
import { AppTrans } from '~/components/AppTrans'
import React from 'react'

const showLoadingTip = () => {
  const loading = cogoToast.loading(
    <AppTrans i18nKey='isTradingConnectionAvailable' />,
    {
      hideAfter: 100000,
      onClick: () => {
        loading.hide?.()
      },
    },
  )

  return loading
}

function _applyEventsObservers() {
  $('body').off('mouseover.bootstrap')
  angularAPI.$rootScope?.$watch(
    () => angularAPI.$rootScope?.session.user.portfolio.manualPositions.length,
    newValue => {
      const ids = map(
        angularAPI.$rootScope?.session.user.portfolio.manualPositions,
        data => data.PositionID,
      )

      store.dispatch(setGroupPositionIds(ids))
    },
  )

  let loadingTip = !angularAPI.getTradingConnectionAvailable()
    ? showLoadingTip()
    : undefined

  globalThis.setInterval(
    (function checkTradingSystemConnection() {
      const isOnline =
        angularAPI.getTradingConnectionAvailable() && navigator.onLine

      if (isOnline === true) {
        loadingTip?.hide?.()
      } else {
        loadingTip?.hide?.()
        loadingTip = showLoadingTip()
      }

      return checkTradingSystemConnection
    })(),
    5000,
  )

  /** On Execution-Dialog closed */
  angularAPI.$rootScope?.$watch(
    () => angularAPI.isNativeTradeDialogOpen,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        store.dispatch(syncNativeTradeDialogOpen(newValue))
      }

      if (newValue !== oldValue && newValue === false) {
        debugAPI.angular.extend('isDialogOpen')(newValue)
        emitter.emit(Events.onDialogNotFound)
      }
    },
  )

  /** Angular.on $routeChangeSuccess */
  angularAPI.$rootScope?.$on('$routeChangeSuccess', angularEvent => {
    debugAPI.angular.extend('$routeChangeSuccess')(globalThis.location.pathname)

    store.dispatch(toggleTradeDashboard(false))

    globalThis.setTimeout(() => {
      emitter.emit(Events.onMountUIs)
    }, 500)
  })

  /**
   * Make sure whole extension UI renders
   *
   * Useful if components unexpected missing renders for example, angular route
   * changes will remove containers (which is React-Components), re-renders
   * ASAP is provider better UX
   *
   * Balance with performance (via throttle)
   */
  $('body').on(
    'mouseover',
    '.main-app-view',
    throttle(event => {
      emitter.emit(Events.onMountUIs)
    }, 1500),
  )

  /**
   * Make sure Execution-Dialog extension UI renders
   *
   * Balance with performance (via throttle)
   */
  $('body').on(
    'mouseover',
    '.uidialog-content',
    throttle(event => {
      const isDialogOpen = angularAPI.isNativeTradeDialogOpen

      if (!isDialogOpen) {
        emitter.emit(Events.onDialogNotFound)
        return
      }

      const dialogComponentsNotReady = [
        $(`[id="${registeredExecutionDialogStatusInfo.container.id}"]`).length >
          0,
        $(`[id="${exectionDialogPrices.container.id}"]`).length > 0,
      ].some(isReady => !isReady)

      if (isDialogOpen && dialogComponentsNotReady) {
        emitter.emit(Events.onDialogHover)
      }
    }, 500),
  )

  /**
   * "I want to close all positions" the dialog get display
   *
   * Balance with performance (via throttle)
   */
  $('body').on(
    'mouseover',
    `[data-etoro-automation-id="close-all-positions-window"]`,
    throttle(() => {
      emitter.emit(Events.onCloseAllPositionsDialogHover)
    }, 1000),
  )

  /** "More Button"(s) on hover */
  $('body').on(
    'mouseover',
    '.more-info-button',
    throttle(() => {
      emitter.emit(Events.onMoreInfoButtonHover)
    }, 1000),
  )

  debugAPI.universal('extension events get ready!')
}

export const applyEventsObservers = throttle(_applyEventsObservers, 30000)

applyEventsObservers['displayName'] = _applyEventsObservers.name
