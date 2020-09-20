import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import cogoToast from 'cogo-toast'
import React, { Fragment, useState } from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { AppTrans } from '~/components/AppTrans'
import { getMYR, getNTD } from '~/exchange'
import { gaAPI, GaEventId } from '~/gaAPI'
import { MalaysiaIcon } from '~/Icons/MalaysiaIcon'
import { TaiwanIcon } from '~/Icons/TaiwanIcon'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { BetterEtoroUIConfig } from '~/storage'

export const SettingSelectedExchange: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const selectedExchange = useAppSelector(
    state => state.settings.selectedExchange,
  )
  const [yourSelected, setYourSelected] = useState(selectedExchange)

  return (
    <Grid container direction='column'>
      <Grid item>
        <FormLabel>
          <AppTrans
            i18nKey='exchange_usedSetup_brief'
            values={{
              text: selectedExchange,
            }}
          ></AppTrans>
        </FormLabel>
      </Grid>

      <Grid item>
        <ToggleButtonGroup
          defaultValue={selectedExchange}
          value={yourSelected}
          exclusive
          onChange={async (
            event,
            value: BetterEtoroUIConfig['selectedExchange'],
          ) => {
            const loading = cogoToast.loading(
              <AppTrans i18nKey='universal_doChanging_text'></AppTrans>,
              {
                position: 'bottom-left',
              },
            )

            setYourSelected(value)
            const youSelected = value

            gaAPI.sendEvent(
              GaEventId.setting_currencyUseSet,
              `value=${youSelected}`,
            )

            if (youSelected === 'HIDDEN') {
              dispatch(
                setBetterEtoroUIConfig({
                  selectedExchange: youSelected,
                }),
              )
            }

            if (youSelected === 'NTD') {
              dispatch(
                setBetterEtoroUIConfig({
                  NTD: await getNTD(),
                  selectedExchange: youSelected,
                }),
              )
            }

            if (youSelected === 'MYR') {
              dispatch(
                setBetterEtoroUIConfig({
                  MYR: await getMYR(),
                  selectedExchange: youSelected,
                }),
              )
            }

            cogoToast
              .success(
                <AppTrans
                  i18nKey='universal_doChanged_text'
                  values={{
                    text: youSelected,
                  }}
                ></AppTrans>,
                { position: 'bottom-left' },
              )
              .then(() => {
                setYourSelected(value)
              })

            loading.hide?.()
          }}
        >
          <ToggleButton value={'NTD' as typeof selectedExchange}>
            <TaiwanIcon></TaiwanIcon>
          </ToggleButton>

          <ToggleButton value={'MYR' as typeof selectedExchange}>
            <MalaysiaIcon></MalaysiaIcon>
          </ToggleButton>

          <ToggleButton value={'HIDDEN' as typeof selectedExchange}>
            <VisibilityOffIcon></VisibilityOffIcon>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  )
}
