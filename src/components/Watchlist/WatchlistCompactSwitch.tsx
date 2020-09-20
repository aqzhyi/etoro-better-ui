import { FormControlLabel, Switch } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const WatchlistCompactSwitch = () => {
  const dispatch = useAppDispatch()
  const listCompactOn = useAppSelector(state => state.settings.listCompactOn)

  return (
    <FormControlLabel
      label={<AppTrans i18nKey='universal_compact_text'></AppTrans>}
      control={
        <Switch
          checked={listCompactOn}
          onChange={(event, checked) => {
            const enabled = !listCompactOn

            angularAPI.toggleListCompact(enabled)
            gaAPI.sendEvent(
              GaEventId.setting_compactEnabledSet,
              `onOff=${String(enabled)}`,
            )
            dispatch(
              setBetterEtoroUIConfig({
                listCompactOn: enabled,
              }),
            )
          }}
        ></Switch>
      }
    ></FormControlLabel>
  )
}
