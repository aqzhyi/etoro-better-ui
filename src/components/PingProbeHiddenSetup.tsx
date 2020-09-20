import { FormControlLabel, Slider } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { AppTrans } from '~/components/AppTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const PingProbeHiddenSetup: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const pingRate = useAppSelector(
    state => state.settings.intervalCheckingStatus,
  )

  return (
    <FormControlLabel
      label={
        <AppTrans i18nKey='universal_intervalCheckingStatus_brief'></AppTrans>
      }
      labelPlacement='top'
      control={
        <Slider
          min={5}
          max={60 * 5}
          step={1}
          defaultValue={pingRate}
          valueLabelDisplay='auto'
          marks={[
            {
              value: 5,
              label: '5s',
            },
            {
              value: 30,
              label: '30s',
            },
            {
              value: 120,
              label: '120s',
            },
            {
              value: 300,
              label: '300s',
            },
          ]}
          onChangeCommitted={(event, value) => {
            if (Array.isArray(value)) {
              return
            }
            gaAPI.sendEvent(
              GaEventId.setting_intervalCheckingStatus,
              `interval=${value}`,
            )
            dispatch(
              setBetterEtoroUIConfig({
                intervalCheckingStatus: value,
              }),
            )
          }}
        />
      }
    ></FormControlLabel>
  )
}
