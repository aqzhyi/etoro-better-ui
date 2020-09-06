import { Button, Grid } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { KeyProbe } from '~/components/KeyProbe'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useDialogLeverAvailable } from '~/hooks/useDialogLeverAvailable'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const ExecutionDialogLeverTradeButtonsGrid: React.FC = props => {
  const dispatch = useAppDispatch()
  const levers = useDialogLeverAvailable()

  const leverShouldBe = useAppSelector(
    state => state.settings.executionLeverLast,
  )

  const onClick = (value: number) => {
    gaAPI.sendEvent(GaEventId.dialog_leverButtonsClick, `lever=${value}`)

    angularAPI.setDialogLever(value)

    dispatch(
      setBetterEtoroUIConfig({
        executionLeverLast: value,
      }),
    )
  }

  return (
    <Grid container direction='column'>
      <Grid item>
        <h2 style={{ textAlign: 'center' }}>
          <PrimaryTrans i18nKey='universal_lever_text'></PrimaryTrans>
        </h2>
      </Grid>

      <Grid item container direction='column'>
        {levers?.map((value, index) => {
          return (
            <Grid item key={index} style={{ marginBottom: 4 }}>
              <Button
                variant={(leverShouldBe === value && 'contained') || 'outlined'}
                color='primary'
                fullWidth
                size='small'
                onClick={() => {
                  onClick(value)
                }}
                endIcon={
                  index + 1 <= 4 && (
                    <KeyProbe
                      filter={`F${index + 1}`}
                      command={() => {
                        onClick(value)
                      }}
                    ></KeyProbe>
                  )
                }
              >
                <Grid container justify='center'>
                  <Grid item>x{value}</Grid>
                </Grid>
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
