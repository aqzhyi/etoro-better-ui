import React from 'react'
import { Toggle } from '@fluentui/react'
import { i18n } from '@/i18n'
import { angularAPI } from '@/angularAPI'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { gaAPI, GaTargetEventId } from '@/gaAPI'

export const WatchlistInvestedSwitch = () => {
  const dispatch = useAppDispatch()
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )

  return (
    <Toggle
      label={i18n.使已投資顯示()}
      inlineLabel
      checked={shouldShowInvested}
      onClick={() => {
        const enabled = !shouldShowInvested

        angularAPI.toggleListInvested(!shouldShowInvested)

        gaAPI.sendEvent(
          GaTargetEventId.setting_investedEnabledSet,
          `onOff=${String(enabled)}`,
        )

        dispatch(setBetterEtoroUIConfig({ showInvested: enabled }))
      }}
    />
  )
}
