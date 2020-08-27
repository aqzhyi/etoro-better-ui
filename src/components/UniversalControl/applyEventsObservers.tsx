import { angularAPI } from '~/angularAPI'
import { registeredExecutionDialogControls } from '~/components/ExecutionDialog/ExecutionDialogControls'
import { registeredExecutionDialogStatusInfo } from '~/components/ExecutionDialog/ExecutionDialogStatusInfo'
import { debugAPI } from '~/debugAPI'
import { emitter, Events } from '~/emitter'
import { initializeIcons } from '@fluentui/react'
import { throttle } from 'lodash'
import store from '~/store/_store'
import { exectionDialogPrices } from '~/components/ExecutionDialog/ExecutionDialogPrices'

let autoRenderOnRouteChangeSuccessTimerId: ReturnType<
  typeof globalThis['setTimeout']
>

function _applyEventsObservers() {
  $('body').off('mouseover.bootstrap')

  initializeIcons()

  /**
   * On Execution-Dialog closed
   */
  angularAPI.$rootScope?.$watch(
    () => {
      return angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen
    },
    (newValue, oldValue) => {
      if (newValue !== oldValue && newValue === false) {
        debugAPI.angular.extend('isDialogOpen')(newValue)
        emitter.emit(Events.onDialogNotFound)
      }
    },
  )

  /**
   * Angular.on $routeChangeSuccess
   */
  angularAPI.$rootScope?.$on('$routeChangeSuccess', angularEvent => {
    debugAPI.angular.extend('$routeChangeSuccess')(globalThis.location.pathname)

    emitter.emit(Events.onUnmountUIs)

    globalThis.clearTimeout(autoRenderOnRouteChangeSuccessTimerId)

    autoRenderOnRouteChangeSuccessTimerId = globalThis.setTimeout(() => {
      emitter.emit(Events.onMountUIs)
    }, 500)
  })

  /**
   * Make sure whole extension UI renders
   *
   * useful if components unexpected missing renders
   * for example, angular route changes will remove containers (which is React-Components),
   * re-renders ASAP is provider better UX
   *
   * balance with performance (via throttle)
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
   * balance with performance (via throttle)
   */
  $('body').on(
    'mouseover',
    '.uidialog-content',
    throttle(event => {
      const isDialogOpen =
        angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen

      if (!isDialogOpen) {
        emitter.emit(Events.onDialogNotFound)
        return
      }

      const dialogComponentsNotReady = [
        $(`#${registeredExecutionDialogControls.container.id}`).length > 0,
        $(`#${registeredExecutionDialogStatusInfo.container.id}`).length > 0,
        $(`#${exectionDialogPrices.container.id}`).length > 0,
      ].some(isReady => !isReady)

      if (isDialogOpen && dialogComponentsNotReady) {
        emitter.emit(Events.onDialogHover)
      }
    }, 500),
  )

  /**
   * "I want to close all positions" the dialog get display
   *
   * balance with performance (via throttle)
   */
  $('body').on(
    'mouseover',
    `[data-etoro-automation-id="close-all-positions-window"]`,
    throttle(() => {
      emitter.emit(Events.onCloseAllPositionsDialogHover)
    }, 1000),
  )

  /**
   * "More Button"(s) on hover
   */
  $('body').on(
    'mouseover',
    '.more-info-button',
    throttle(() => {
      emitter.emit(Events.onMoreInfoButtonHover)
    }, 50),
  )

  /**
   * Ping every interval
   *
   * useful in continuously status checking... etc.
   */
  let onPingIntervalId: ReturnType<typeof globalThis.setInterval>
  const onPingLastIntervalMS = store.getState().settings.intervalCheckingStatus
  store.subscribe(() => {
    const intervalMS = store.getState().settings.intervalCheckingStatus * 1000

    if (intervalMS !== onPingLastIntervalMS) {
      globalThis.clearInterval(onPingIntervalId)

      onPingIntervalId = globalThis.setInterval(() => {
        emitter.emit(Events.onPing)
      }, intervalMS)
    }
  })

  debugAPI.universal('extension events get ready!')
}

export const applyEventsObservers = throttle(_applyEventsObservers, 30000)

applyEventsObservers['displayName'] = _applyEventsObservers.name
