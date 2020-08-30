import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import React from 'react'
import {
  FormControlLabel,
  FormControlLabelProps,
  Switch,
} from '@material-ui/core'

export const ExecutionDialogFixedStopLossTakeProfitToggle: React.FC<{
  labelPlacement?: FormControlLabelProps['labelPlacement']
}> = props => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state => state.settings.stopLossAndTakeProfitUseLastPercent,
  )

  return (
    <React.Fragment>
      <PrimaryTooltip
        tooltipProps={{
          placement: 'right',
        }}
        title={
          <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_brief'></PrimaryTrans>
        }
      >
        <span style={{ display: 'inline-block' }}>
          <FormControlLabel
            label={
              <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_shortLabel'></PrimaryTrans>
            }
            labelPlacement={props.labelPlacement}
            control={
              <Switch
                defaultChecked={enabled}
                onChange={(event, yourEnabled) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      stopLossAndTakeProfitUseLastPercent: yourEnabled,
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </span>
      </PrimaryTooltip>
    </React.Fragment>
  )
}
