import ReactGA from 'react-ga'
import { debugAPI } from '@/debugAPI'
import store from '@/store/_store'

// https://analytics.google.com/analytics/web/#/report-home/a60395189w239423479p223675747
ReactGA.initialize('UA-60395189-2', { redactEmail: false })

/**
 * naming rule
 * e.g. {category}_{event}
 */
export enum GaTargetEventId {
  dialog_amountButtonsClick,
  dialog_buttonsArrangeClick,
  dialog_leverButtonsClick,
  keyboard_closeDialog,
  keyboard_switchBuySell,
  setting_amountButtonsSet,
  setting_compactEnabledSet,
  setting_currencyUseSet,
  setting_dialogMacroEnabledSet,
  setting_investedEnabledSet,
  setting_resetAllClick,
  setting_sameOrderEnabledSet,
  setting_tabToBuySellEnabledSet,
  setting_TakeProfitAndStopLoseEnabledSet,
}

export const gaAPI = {
  sendEvent(targetEventId: GaTargetEventId, label?: string) {
    const state = store.getState()

    if (!state.settings.googleAnalyticsEnabled) {
      return
    }

    const eventInfo = GaTargetEventId[targetEventId].split('_')

    const category = eventInfo[0]
    const action = eventInfo[1]

    debugAPI.ga(
      `category=${category}, action=${action}, label=${label || '__NONE__'}`,
    )

    ReactGA.event({
      category,
      action,
      label,
    })
  },
}
