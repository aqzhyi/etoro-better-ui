import { Button, Grid } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useDialogModel } from '~/hooks/useDialogModel'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const ExecutionDialogLeverTradeButtonsGrid: React.FC = props => {
  const dispatch = useAppDispatch()
  const dialog = useDialogModel()

  const leverShouldBe = useAppSelector(
    state => state.settings.executionLeverLast,
  )

  return (
    <Grid container direction='column'>
      <Grid item>
        <h2 style={{ textAlign: 'center' }}>
          <PrimaryTrans i18nKey='universal_lever_text'></PrimaryTrans>
        </h2>
      </Grid>

      <Grid item container direction='column'>
        {dialog.model?.instrument.Leverages?.map((value, index) => {
          return (
            <Grid item key={index} style={{ marginBottom: 4 }}>
              <Button
                variant={(leverShouldBe === value && 'contained') || 'outlined'}
                color='primary'
                fullWidth
                size='small'
                onClick={() => {
                  gaAPI.sendEvent(
                    GaEventId.dialog_leverButtonsClick,
                    `lever=${value}`,
                  )

                  angularAPI.setDialogLever(value)

                  dispatch(
                    setBetterEtoroUIConfig({
                      executionLeverLast: value,
                    }),
                  )
                }}
              >
                x{value}
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
