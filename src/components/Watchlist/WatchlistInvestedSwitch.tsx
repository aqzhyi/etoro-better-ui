import React from 'react'
import { Toggle } from '@fluentui/react'
import { angularAPI } from '@/angularAPI'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { gaAPI, GaEventId } from '@/gaAPI'
import { useTranslation } from 'react-i18next'

export const WatchlistInvestedSwitch = () => {
  const locale = useTranslation()
  const dispatch = useAppDispatch()
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )

  return (
    <Toggle
      label={locale.t('profits_invested_text')}
      inlineLabel
      checked={shouldShowInvested}
      onClick={() => {
        const enabled = !shouldShowInvested

        angularAPI.toggleListInvested(!shouldShowInvested)

        gaAPI.sendEvent(
          GaEventId.setting_investedEnabledSet,
          `onOff=${String(enabled)}`,
        )

        dispatch(setBetterEtoroUIConfig({ showInvested: enabled }))
      }}
    />
  )
}
