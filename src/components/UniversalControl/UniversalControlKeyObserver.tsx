import { useAppSelector } from '@/store/_store'
import React from 'react'
import { useKey } from 'react-use'
import { debugAPI } from '@/debugAPI'
import { registerReactComponent } from '@/utils/registerReactComponent'

const ELEMENT_ID = 'universal-control-key-observer'

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

  return <span id={ELEMENT_ID}></span>
}

registerReactComponent({
  component: <UniversalControlKeyObserver />,
  containerId: UniversalControlKeyObserver.name,
  containerConstructor: containerElement => {
    $(`[automation-id="left-menu-deposit-button"]`).append(containerElement)
  },
})
