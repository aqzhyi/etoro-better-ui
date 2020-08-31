import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined'
import SyncProblemOutlinedIcon from '@material-ui/icons/SyncProblemOutlined'
import React from 'react'
import { useGetSet, useInterval } from 'react-use'
import styled from 'styled-components'
import { angularAPI } from '~/angularAPI'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { emitter, Events } from '~/emitter'
import { GM } from '~/GM'
import { useDialogModel } from '~/hooks/useDialogModel'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'

/**
 * expected error gap
 *
 * `1.5` means 1.5%
 */
const errorGapInPercents = 1.5

export const ExecutionDialogTakeProfitStopLossControls: React.FC<{
  className?: string
}> = props => {
  const dialog = useDialogModel()
  const enabled = useAppSelector(
    state => state.settings.stopLossAndTakeProfitUseLastPercent,
  )

  const stopLossShouldBe = useAppSelector(
    state => state.settings.stopLossLastPercent,
  )

  const takeProfitShouldBe = useAppSelector(
    state => state.settings.takeProfitLastPercent,
  )

  const [isStopLossFixed, setIsStopLossFixed] = useGetSet(false)
  const [isTakeProfitFixed, setIsTakeProfitFixed] = useGetSet(false)

  /**
   * `true` means the value should be expected, and it's may in error gap
   */
  const checkIsSync = (value?: number, expected?: number) => {
    if (!value || !expected) {
      return false
    }

    /**
     * `0` means value has no gap
     *
     * `10` means value has 10% gap
     */
    const gap = Math.abs(1 - value / expected) * 100

    return errorGapInPercents > gap
  }

  const checkIsStopLossSync = () =>
    checkIsSync(dialog.model?.stopLoss, stopLossShouldBe)

  const checkIsTakeProfitSync = () =>
    checkIsSync(dialog.model?.takeProfit, takeProfitShouldBe)

  useInterval(
    () => {
      if (!enabled || isStopLossFixed()) {
        return
      }

      if (checkIsStopLossSync()) {
        setIsStopLossFixed(true)
        return
      }

      angularAPI.setDialogStopLoss(stopLossShouldBe)
    },
    enabled && !isStopLossFixed() ? 500 : null,
  )

  useInterval(
    () => {
      if (!enabled || isTakeProfitFixed()) {
        return
      }

      if (checkIsTakeProfitSync()) {
        setIsTakeProfitFixed(true)
        return
      }

      angularAPI.setDialogTakeProfit(takeProfitShouldBe)
    },
    enabled && !isTakeProfitFixed() ? 500 : null,
  )

  return (
    <React.Fragment>
      <StyledStopLoss>
        <PrimaryTooltip
          title={
            <PrimaryTrans
              i18nKey='profits_fixedTakeProfitValueOnOrder_help'
              values={{
                value: stopLossShouldBe,
              }}
            ></PrimaryTrans>
          }
        >
          {!enabled ? (
            <PauseCircleFilledIcon />
          ) : checkIsStopLossSync() ? (
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
                value: takeProfitShouldBe,
              }}
            ></PrimaryTrans>
          }
        >
          {!enabled ? (
            <PauseCircleFilledIcon />
          ) : checkIsTakeProfitSync() ? (
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
