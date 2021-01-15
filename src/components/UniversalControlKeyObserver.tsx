import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { WatchlistHeader } from '~/components/Watchlist/WatchlistHeader'
import { debugAPI } from '~/debugAPI'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import cogoToast from 'cogo-toast'
import React, { useCallback, useEffect } from 'react'
import { useKey } from 'react-use'

const KEYBOARD_ENABLED_CLASSNAME = 'etoro-better-ui__keyboard-enabled'
const KEYBOARD_DISABLED_CLASSNAME = 'etoro-better-ui__keyboard-disabled'

export const UniversalControlKeyObserver = () => {
  const dispatch = useAppDispatch()
  const hotkeySettings = useAppSelector(state => state.settings.useHotkeys)

  const isInputUsesFocusing = () => {
    return (
      $('input').filter((index, element) => $(element).is(':focus')).length > 0
    )
  }

  const notifyFunctionShouldEnable = useCallback(() => {
    cogoToast.info(
      <AppTrans i18nKey='universal_useKeyboardHotkeys_help'></AppTrans>,
      // i18n.universal_useKeyboardHotkeys_help(() => {
      //   dispatch(toggleSettingsDialog(true))
      // }),
      {
        position: 'top-right',
        hideAfter: 5,
      },
    )
  }, [])

  useEffect(() => {
    if (Object.values(hotkeySettings).some(data => !!data)) {
      $('body')
        .addClass(KEYBOARD_ENABLED_CLASSNAME)
        .removeClass(KEYBOARD_DISABLED_CLASSNAME)
    } else {
      $('body')
        .removeClass(KEYBOARD_ENABLED_CLASSNAME)
        .addClass(KEYBOARD_DISABLED_CLASSNAME)
    }
  }, [hotkeySettings])

  /** 使下單框以 Tab 鍵切換「賣出」及「買入」 */
  useKey(
    'Tab',
    event => {
      const targetElement = $('.execution-head-buttons')

      if (isInputUsesFocusing()) return
      if (!targetElement.length) return
      if (!hotkeySettings.dialogBuySellSwitch) {
        notifyFunctionShouldEnable()
        return
      }

      debugAPI.keyboard.extend('TAB')(event.key)

      gaAPI.sendEvent(GaEventId.keyboard_switchBuySell)
      targetElement.find('.execution-head-button:not(.active)').trigger('click')
      targetElement.find('.execution-head-button.active').trigger('focus')
    },
    {},
    [hotkeySettings],
  )

  /** 使 ESC 能夠關閉任意 Dialog */
  useKey(
    'Escape',
    event => {
      const targetElement = $('[automation-id="close-dialog-btn"]')

      if (isInputUsesFocusing()) return
      if (!targetElement.length) return
      if (!hotkeySettings.dialogClose) {
        notifyFunctionShouldEnable()
        return
      }

      debugAPI.keyboard.extend('ESC')(event.key)

      gaAPI.sendEvent(GaEventId.keyboard_closeDialog)
      targetElement.trigger('click')
    },
    {},
    [hotkeySettings],
  )

  /** The hotkey "SPACE" able to trigger "Open Trade" button with a click */
  useKey(
    ' ',
    event => {
      const targetElement = $(`.execution-button`)

      if (isInputUsesFocusing()) return
      if (!targetElement.length) return
      if (!angularAPI.isNativeTradeDialogOpen) return
      if (!hotkeySettings.dialogOpenTrade) {
        notifyFunctionShouldEnable()
        return
      }

      debugAPI.keyboard.extend('OpenTrade')(event.key)

      gaAPI.sendEvent(GaEventId.keyboard_openTradeClick)
      targetElement.trigger('click')
      event.preventDefault()
    },
    {},
    [hotkeySettings],
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
  .${KEYBOARD_DISABLED_CLASSNAME} .execution-head-button:before { opacity: 0.3; }
  .${KEYBOARD_ENABLED_CLASSNAME} .execution-head-button:before,
  .${KEYBOARD_DISABLED_CLASSNAME} .execution-head-button:before {
    content: '( TAB )';
    transform: translate(0px, -20px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 12px;
    color: #ffffff;
  }

  .${KEYBOARD_DISABLED_CLASSNAME} [automation-id="close-dialog-btn"]:before { opacity: 0.3; }
  .${KEYBOARD_ENABLED_CLASSNAME} [automation-id="close-dialog-btn"]:before,
  .${KEYBOARD_DISABLED_CLASSNAME} [automation-id="close-dialog-btn"]:before {
    content: '( ESC )';
    transform: translate(-20px, 0px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 12px;
    color: #ffffff;
  }

  .${KEYBOARD_DISABLED_CLASSNAME} #${WatchlistHeader.name} .ms-TextField:before { opacity: 0.3; }
  .${KEYBOARD_ENABLED_CLASSNAME} #${WatchlistHeader.name} .ms-TextField:before,
  .${KEYBOARD_DISABLED_CLASSNAME} #${WatchlistHeader.name} .ms-TextField:before {
    content: '( F )';
    transform: translate(110px, 3px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 14px;
    z-index: 1;
    color: #ffffff;
  }

  .${KEYBOARD_DISABLED_CLASSNAME} .execution-button:before { opacity: 0.3; }
  .${KEYBOARD_ENABLED_CLASSNAME} .execution-button:before,
  .${KEYBOARD_DISABLED_CLASSNAME} .execution-button:before {
    content: '( Space )';
    transform: translate(0px, -20px);
    position: fixed;
    display: inline-block;
    text-shadow: 1px 1px 1px black;
    font-size: 12px;
    color: #ffffff;
  }
`)
