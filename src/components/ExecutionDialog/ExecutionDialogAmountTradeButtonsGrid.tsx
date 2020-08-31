import { Button, Grid } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { openPromptForSetMacroAmount } from '~/actions/setMacroAmount'
import { angularAPI } from '~/angularAPI'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const ExecutionDialogAmountTradeButtonsGrid: React.FC = props => {
  const dispatch = useAppDispatch()
  const amounts = useAppSelector(state => state.settings.executionAmount)
  const amountShouldBe = useAppSelector(
    state => state.settings.executionAmountLast,
  )

  return (
    <Grid container direction='column'>
      <Grid item>
        <h2>
          <PrimaryTrans i18nKey='universal_amount_text'></PrimaryTrans>
        </h2>
      </Grid>

      <Grid item container direction='column'>
        {amounts.map((value, index) => {
          return (
            <Grid item key={index} style={{ marginBottom: 4 }}>
              <Button
                variant={
                  (amountShouldBe === value && 'contained') || 'outlined'
                }
                color='primary'
                fullWidth
                size='small'
                onClick={() => {
                  gaAPI.sendEvent(
                    GaEventId.dialog_amountButtonsClick,
                    `amount=${value}`,
                  )

                  angularAPI.setDialogAmount(value)

                  dispatch(
                    setBetterEtoroUIConfig({
                      executionAmountLast: value,
                    }),
                  )
                }}
              >
                ${value}
              </Button>
            </Grid>
          )
        })}
      </Grid>

      <Grid item>
        <Button
          variant='outlined'
          color='primary'
          size='small'
          fullWidth
          onClick={() => {
            gaAPI.sendEvent(GaEventId.dialog_buttonsArrangeClick)
            dispatch(openPromptForSetMacroAmount())
          }}
        >
          <PrimaryTrans i18nKey='common_buttonSetup'></PrimaryTrans>
        </Button>
      </Grid>
    </Grid>
  )
}
