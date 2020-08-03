import { angularAPI } from '@/angularAPI'
import { WatchlistHeader } from '@/components/Watchlist/WatchlistHeader'
import { debugAPI } from '@/debugAPI'
import { gaAPI, GaEventId } from '@/gaAPI'
import { GM } from '@/GM'
import { useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React, { useEffect } from 'react'
import { useKey } from 'react-use'

const KEYBOARD_ENABLED_CLASSNAME = 'etoro-better-ui__keyboard-enabled'

export const UniversalControlKeyObserver = () => {
  const tabBuySellEnabled = useAppSelector(
    state => state.settings.useTabKeyBuySell,
  )

  const isInputUsesFocusing = () => {
    return (
      $('input').filter((index, element) => $(element).is(':focus')).length > 0
    )
  }

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

      if (isInputUsesFocusing()) return
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

      if (isInputUsesFocusing()) return
    if (!targetElement.length) return
    if (!tabBuySellEnabled) return

    debugAPI.keyboard.extend('ESC')(event.key)

    gaAPI.sendEvent(GaEventId.keyboard_closeDialog)
    targetElement.trigger('click')
    },
    {},
    [tabBuySellEnabled],
  )

  /** The hotkey "F" able to get focus on the input of filter */
  useKey(
    'F',
    event => {
      const targetElement = $(`#${WatchlistHeader.name} input`)

      if (isInputUsesFocusing()) return
      if (!targetElement.length) return
      if (!tabBuySellEnabled) return
      if (angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen) return

      debugAPI.keyboard.extend('FilterText')(event.key)

      gaAPI.sendEvent(GaEventId.keyboard_filterTextFocus)
      targetElement.trigger('focus')
    },
    { event: 'keyup' },
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

  .${KEYBOARD_ENABLED_CLASSNAME} #${WatchlistHeader.name} .ms-TextField:hover:before {
    content: '( F )';
    transform: translate(110px, 3px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 14px;
    color: #ffffff;
    z-index: 1;
  }
`)
