import store, { useTypedSelector } from '@/store/_store'
import { throttle } from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { useKey } from 'react-use'
import { debugAPI } from '@/debugAPI'

const ELEMENT_ID = 'universal-control-key-observer'
const ELEMENT_ID_ROOT = 'universal-control-key-observer-root'

export const UniversalControlKeyObserver = () => {
  const tabBuySellEnabled = useTypedSelector(
    state => state.settings.betterEtoroUIConfig.useTabKeyBuySell,
  )

  /** 使下單框以 Tab 鍵切換「賣出」及「買入」 */
  useKey(
    'Tab',
    event => {
      debugAPI.keyboard.extend('tabBuySellEnabled')(
        tabBuySellEnabled,
        event.key,
      )
      if (tabBuySellEnabled) {
        $('.execution-head-buttons .execution-head-button:not(.active)').click()
        $('.execution-head-buttons .execution-head-button.active').focus()
      }
    },
    {},
    [tabBuySellEnabled],
  )

  return <span id={ELEMENT_ID}></span>
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
