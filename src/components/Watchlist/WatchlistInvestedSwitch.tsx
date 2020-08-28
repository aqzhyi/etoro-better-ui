import { FormControlLabel, Switch } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const WatchlistInvestedSwitch = () => {
  const dispatch = useAppDispatch()
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )

  return (
    <FormControlLabel
      label={<PrimaryTrans i18nKey='profits_invested_text'></PrimaryTrans>}
      control={
        <Switch
          checked={shouldShowInvested}
          onChange={(event, checked) => {
            const enabled = !shouldShowInvested

            angularAPI.toggleListInvested(!shouldShowInvested)

            gaAPI.sendEvent(
              GaEventId.setting_investedEnabledSet,
              `onOff=${String(enabled)}`,
            )

            dispatch(setBetterEtoroUIConfig({ showInvested: enabled }))
          }}
        ></Switch>
      }
    ></FormControlLabel>
  )
}
