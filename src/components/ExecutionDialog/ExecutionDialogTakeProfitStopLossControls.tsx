import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined'
import SyncProblemOutlinedIcon from '@material-ui/icons/SyncProblemOutlined'
import React, { useState } from 'react'
import { useInterval, useMount } from 'react-use'
import styled from 'styled-components'
import { angularAPI } from '~/angularAPI'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { emitter, Events } from '~/emitter'
import { GM } from '~/GM'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'

/** 在此倍率中，屬於正常誤差範圍 */
const errorGapInPercents = 1.5

export const ExecutionDialogTakeProfitStopLossControls: React.FC<{
  className?: string
}> = props => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state => state.settings.stopLossAndTakeProfitUseLastPercent,
  )

  const lastPercentOfStopLoss = useAppSelector(
    state => state.settings.stopLossLastPercent,
  )

  const lastPercentOfTakeProfit = useAppSelector(
    state => state.settings.takeProfitLastPercent,
  )

  const [stopLossViewValue, stopLossViewValueSetter] = useState(
    angularAPI.executionDialogScope?.model?.stopLoss.percentAmount,
  )
  const [takeProfitViewValue, takeProfitViewValueSetter] = useState(
    angularAPI.executionDialogScope?.model?.takeProfit.percentAmount,
  )

  useInterval(() => {
    if (!angularAPI.executionDialogScope?.model || !enabled) {
      return
    }

    stopLossViewValueSetter(
      angularAPI.executionDialogScope?.model?.stopLoss.percentAmount,
    )

    takeProfitViewValueSetter(
      angularAPI.executionDialogScope?.model?.takeProfit.percentAmount,
    )
  }, 400)

  useMount(() => {
    if (!enabled) {
      return
    }

    lastPercentOfStopLoss && angularAPI.setDialogStopLoss(lastPercentOfStopLoss)

    lastPercentOfTakeProfit &&
      angularAPI.setDialogTakeProfit(lastPercentOfTakeProfit)
  })

  useMount(() => {
    angularAPI.executionDialogScope?.$apply()
  })

  if (!enabled) {
    return null
  }

  return (
    <React.Fragment>
      <StyledStopLoss>
        <PrimaryTooltip
          title={
            <PrimaryTrans
              i18nKey='profits_fixedTakeProfitValueOnOrder_help'
              values={{
                value: lastPercentOfStopLoss,
              }}
            ></PrimaryTrans>
          }
        >
          {Math.abs((stopLossViewValue ?? 100) / lastPercentOfStopLoss) <
          errorGapInPercents ? (
            <SyncOutlinedIcon />
          ) : (
            <SyncProblemOutlinedIcon />
          )}
        </PrimaryTooltip>
      </StyledStopLoss>

      <StyledTakeProfit>
        <PrimaryTooltip
          title={
            <PrimaryTrans
              i18nKey='profits_fixedTakeProfitValueOnOrder_help'
              values={{
                value: lastPercentOfTakeProfit,
              }}
            ></PrimaryTrans>
          }
        >
          {Math.abs((takeProfitViewValue ?? 100) / lastPercentOfTakeProfit) <
          errorGapInPercents ? (
            <SyncOutlinedIcon />
          ) : (
            <SyncProblemOutlinedIcon />
          )}
        </PrimaryTooltip>
      </StyledTakeProfit>
    </React.Fragment>
  )
}

const StyledStopLoss = styled.span`
  position: absolute;
  width: auto;
  display: flex;
  justify-content: flex-end;
  top: 22px;
  left: 20px;
`

const StyledTakeProfit = styled.span`
  position: absolute;
  width: auto;
  display: flex;
  justify-content: flex-end;
  top: 22px;
  right: 20px;
`

const registeredExecutionDialogTakeProfitControls = registerReactComponent({
  component: <ExecutionDialogTakeProfitStopLossControls />,
  containerId: ExecutionDialogTakeProfitStopLossControls.name,
  containerConstructor: containerElement => {
    $('tabstitles').append(containerElement)
  },
  disabled: () => {
    if (isDisabledInProchart()) return true
    return false
  },
})

emitter.on(
  Events.onDialogHover,
  registeredExecutionDialogTakeProfitControls.mount,
)
emitter.on(
  Events.onDialogNotFound,
  registeredExecutionDialogTakeProfitControls.unmount,
)

GM.addStyle(`
  tabstitles {
    position: relative;
  }
`)
