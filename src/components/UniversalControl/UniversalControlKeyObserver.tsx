import store, { useAppSelector } from '@/store/_store'
import { throttle } from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { useKey } from 'react-use'
import { debugAPI } from '@/debugAPI'
import { UniversalEtoroStatusObserver } from '@/components/UniversalControl/UniversalEtoroStatusObserver'

const ELEMENT_ID = 'universal-control-key-observer'
const ELEMENT_ID_ROOT = 'universal-control-key-observer-root'

export const UniversalControlKeyObserver = () => {
  const tabBuySellEnabled = useAppSelector(
    state => state.settings.betterEtoroUIConfig.useTabKeyBuySell,
  )

  /** 使下單框以 Tab 鍵切換「賣出」及「買入」 */
  useKey(
    'Tab',
    event => {
      const targetElement = $('.execution-head-buttons')

      if (!targetElement.length) return
      if (!tabBuySellEnabled) return

      debugAPI.keyboard.extend('tabBuySellEnabled')(
        tabBuySellEnabled,
        event.key,
      )

      targetElement.find('.execution-head-button:not(.active)').click()
      targetElement.find('.execution-head-button.active').focus()
    },
    {},
    [tabBuySellEnabled],
  )

  /** 使 ESC 能夠關閉下單視窗 */
  useKey('Escape', event => {
    const targetElement = $('.execution-head')

    if (!targetElement.length) return

    debugAPI.keyboard.extend('下單視窗')(event.key)

    $('[automation-id="close-dialog-btn"]').click()
  })

  return (
    <span id={ELEMENT_ID}>
      <UniversalEtoroStatusObserver></UniversalEtoroStatusObserver>
    </span>
  )
}

UniversalControlKeyObserver.hasReady = () => !!$(`#${ELEMENT_ID}`).length

UniversalControlKeyObserver.construct = () => {
  if (UniversalControlKeyObserver.hasReady()) {
    return
  }

  if (!$(`#${ELEMENT_ID_ROOT}`).length) {
    $(`[automation-id="left-menu-deposit-button"]`).append(
      $(`<span id=${ELEMENT_ID_ROOT}></span>`),
    )
  }

  $(`#${ELEMENT_ID_ROOT}`).length &&
    ReactDOM.render(
      <Provider store={store}>
        <UniversalControlKeyObserver></UniversalControlKeyObserver>
      </Provider>,
      $(`#${ELEMENT_ID_ROOT}`).html('').get(0),
    )
}
