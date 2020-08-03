import { useAppSelector } from '@/store/_store'
import React, { useEffect, useMemo } from 'react'
import { useKey } from 'react-use'
import { debugAPI } from '@/debugAPI'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { gaAPI, GaEventId } from '@/gaAPI'
import { GM } from '@/GM'

const KEYBOARD_ENABLED_CLASSNAME = 'etoro-better-ui__keyboard-enabled'

export const UniversalControlKeyObserver = () => {
  const tabBuySellEnabled = useAppSelector(
    state => state.settings.useTabKeyBuySell,
  )

  const isInputEditing = useMemo(() => {
    return (
      $('input').filter((index, element) => $(element).is(':focus')).length > 0
    )
  }, [])

  useEffect(() => {
    if (tabBuySellEnabled) {
      $('body').addClass(KEYBOARD_ENABLED_CLASSNAME)
    } else {
      $('body').removeClass(KEYBOARD_ENABLED_CLASSNAME)
    }
  }, [tabBuySellEnabled])

  /** 使下單框以 Tab 鍵切換「賣出」及「買入」 */
  useKey(
    'Tab',
    event => {
      const targetElement = $('.execution-head-buttons')

      if (isInputEditing) return
      if (!targetElement.length) return
      if (!tabBuySellEnabled) return

      debugAPI.keyboard.extend('TAB')(event.key)

      gaAPI.sendEvent(GaEventId.keyboard_switchBuySell)
      targetElement.find('.execution-head-button:not(.active)').trigger('click')
      targetElement.find('.execution-head-button.active').trigger('focus')
    },
    {},
    [tabBuySellEnabled],
  )

  /** 使 ESC 能夠關閉任意 Dialog */
  useKey(
    'Escape',
    event => {
    const targetElement = $('[automation-id="close-dialog-btn"]')

    if (isInputEditing) return
    if (!targetElement.length) return
    if (!tabBuySellEnabled) return

    debugAPI.keyboard.extend('ESC')(event.key)

    gaAPI.sendEvent(GaEventId.keyboard_closeDialog)
    targetElement.trigger('click')
    },
    {},
    [tabBuySellEnabled],
  )

  return <span></span>
}

registerReactComponent({
  component: <UniversalControlKeyObserver />,
  containerId: UniversalControlKeyObserver.name,
  containerConstructor: containerElement => {
    $(`[automation-id="left-menu-deposit-button"]`).append(containerElement)
  },
})

GM.addStyle(`
  .${KEYBOARD_ENABLED_CLASSNAME} .execution-head-button:hover:before {
    content: '( TAB )';
    transform: translate(0px, -20px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 12px;
    color: #ffffff;
  }

  .${KEYBOARD_ENABLED_CLASSNAME} [automation-id="close-dialog-btn"]:hover:before {
    content: '( ESC )';
    transform: translate(-20px, 0px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 12px;
    color: #ffffff;
  }
`)
