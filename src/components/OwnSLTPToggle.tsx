import { Button } from '@material-ui/core'
import React, { useCallback } from 'react'
import { angularAPI } from '~/angularAPI'
import { KeyProbe } from '~/components/KeyProbe'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { BetterEtoroUIConfig } from '~/storage'
import { useAppSelector } from '~/store/_store'

export const OwnSLTPToggle: React.FC<{
  which: keyof Pick<
    BetterEtoroUIConfig,
    'stopLossLastPercent' | 'takeProfitLastPercent'
  >
}> = props => {
  const percents = useAppSelector(state => state.settings[props.which])

  const DisplayText = () =>
    props.which === 'stopLossLastPercent' ? (
      <AppTrans i18nKey='profits_toggleSL_text'></AppTrans>
    ) : (
      <AppTrans i18nKey='profits_toggleTP_text'></AppTrans>
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
    <AppTooltip
      title={
        <AppTrans
          i18nKey='profits_fixedTakeProfitValueOnOrder_help'
          values={{
            value: percents,
          }}
        ></AppTrans>
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
    </AppTooltip>
  )
}
