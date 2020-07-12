import { debugAPI } from '@/debugAPI'
import store from '@/store/_store'

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

const GA_TRACKER_NAME = 'etoroBetterUi'
const GA_UA_ID = 'UA-60395189-2'

const isProd = process.env.NODE_ENV === 'production'

export const gaAPI = {
  initialize() {
    debugAPI.ga('initializing...')

    ga('create', GA_UA_ID, 'auto', GA_TRACKER_NAME)
  },
  sendEvent(targetEventId: GaTargetEventId, label?: string, value?: number) {
    const enabled = store.getState().settings.googleAnalyticsEnabled

    const eventInfo = GaTargetEventId[targetEventId].split('_')

    const category = eventInfo[0]
    const action = eventInfo[1]

    debugAPI.ga(
      `category=${category}, action=${action}, label=${label || '__NONE__'}` +
        `${enabled ? '' : ', function disabled, not send'}`,
    )

    if (!enabled || !isProd) {
      return
    }

    ga(`${GA_TRACKER_NAME}.send`, 'event', category, action, label, value)
  },
}
