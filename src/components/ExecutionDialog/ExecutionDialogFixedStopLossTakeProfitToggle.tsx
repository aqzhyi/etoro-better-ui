import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { PrimaryTooltip } from '@/components/PrimaryTooltip'
import { PrimaryTrans } from '@/components/PrimaryTrans'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { Label, Toggle } from '@fluentui/react'
import React from 'react'

export const ExecutionDialogFixedStopLossTakeProfitToggle: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state => state.settings.stopLossAndTakeProfitUseLastPercent,
  )

  return (
    <React.Fragment>
      <PrimaryTooltip
        tooltipProps={{
          placement: 'left',
        }}
        overlay={
          <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_brief'></PrimaryTrans>
        }
      >
        <Label>
          <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_shortLabel'></PrimaryTrans>
        </Label>

        <Toggle
          checked={enabled}
          onChange={(event, yourEnabled) => {
            dispatch(
              setBetterEtoroUIConfig({
                stopLossAndTakeProfitUseLastPercent: yourEnabled,
              }),
            )
          }}
        ></Toggle>
      </PrimaryTooltip>
    </React.Fragment>
  )
}
