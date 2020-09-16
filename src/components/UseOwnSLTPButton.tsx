import { Button } from '@material-ui/core'
import React, { useCallback } from 'react'
import { angularAPI } from '~/angularAPI'
import { KeyProbe } from '~/components/KeyProbe'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { BetterEtoroUIConfig } from '~/storage'
import { useAppSelector } from '~/store/_store'

export const UseOwnSLTPButton: React.FC<{
  which: keyof Pick<
    BetterEtoroUIConfig,
    'stopLossLastPercent' | 'takeProfitLastPercent'
  >
}> = props => {
  const percents = useAppSelector(state => state.settings[props.which])

  const DisplayText = () =>
    props.which === 'stopLossLastPercent' ? (
      <PrimaryTrans i18nKey='profits_toggleSL_text'></PrimaryTrans>
    ) : (
      <PrimaryTrans i18nKey='profits_toggleTP_text'></PrimaryTrans>
    )

  const action = useCallback(() => {
    if (props.which === 'stopLossLastPercent') {
      angularAPI.toggleDialogStopLossInfinite()
      angularAPI.setDialogStopLoss(percents)
    } else {
      angularAPI.toggleDialogTakeProfitInfinite()
      angularAPI.setDialogTakeProfit(percents)
    }
  }, [props.which, percents])

  const Hotkey = useCallback(
    () =>
      (props.which === 'stopLossLastPercent' && (
        <KeyProbe
          filter='Q'
          command={() => {
            action()
          }}
        ></KeyProbe>
      )) || (
        <KeyProbe
          filter='E'
          command={() => {
            action()
          }}
        ></KeyProbe>
      ),
    [props.which, action],
  )

  return (
    <PrimaryTooltip
      title={
        <PrimaryTrans
          i18nKey='profits_fixedTakeProfitValueOnOrder_help'
          values={{
            value: percents,
          }}
        ></PrimaryTrans>
      }
    >
      <Button
        variant='outlined'
        onClick={() => {
          action()
        }}
      >
        <DisplayText />
        <Hotkey />
      </Button>
    </PrimaryTooltip>
  )
}
