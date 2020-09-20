import LoopIcon from '@material-ui/icons/Loop'
import React, { useMemo, useState } from 'react'
import { useInterval } from 'react-use'
import styled from 'styled-components'
import { angularAPI } from '~/angularAPI'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { PingProbeValue } from '~/components/PingProbeValue'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { ProfitText } from '~/components/ProfitText'
import { HighlightText } from '~/components/TooltipHighlightText'
import { TradingStatusValue } from '~/components/TradingStatusValue'
import { GM } from '~/GM'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'

export const ExecutionDialogStatusInfo = () => {
  const statusInfo = useAppSelector(state => state.status.statusCheckAggregate)

  /** 推測延遲 */
  const statusPingValue = useAppSelector(state => state.status.pingValue)

  /** status.etoro.com 目前服務狀況 */
  const labelManualTrading =
    statusInfo['Manual trading - Real']?.status === 'Operational' ? (
      '👍'
    ) : statusInfo['Manual trading - Real']?.status ===
      'Degraded Performance' ? (
      '😱'
    ) : (
      <LoopIcon />
    )

  /** 可用餘額 */
  const labelPingValue =
    statusPingValue > 0 ? `${statusPingValue}ms` : <LoopIcon />

  const [positions, positionsSetter] = useState<InstrumentPosition[]>([])

  useInterval(() => {
    const items = angularAPI.$rootScope?.session.user.portfolio.manualPositions?.filter(
      position =>
        position.Instrument.DisplayName ===
        angularAPI.executionDialogScope?.controller?.instrument?.DisplayName,
    )

    positionsSetter(() => [...(items || [])])
  }, 1000)

  const totalProfit = useMemo(() => {
    let totalProfit = 0
    positions?.forEach(data => {
      totalProfit = totalProfit + data.Profit
    })
    return totalProfit
  }, [positions])

  const instrumentName = useMemo(() => {
    return angularAPI.executionDialogScope?.controller?.instrument?.Name
  }, [])

  /** from etoro html element */
  const canUseValue =
    angularAPI.$rootScope?.session.user.portfolio.availibleToTrade || 0
  const availableValueLabel = `$${canUseValue.toFixed(2)}`

  return (
    <React.Fragment>
      <AppTooltip
        title={
          <AppTrans
            i18nKey='profits_selectedObjective_brief'
            values={{
              name: instrumentName,
            }}
          />
        }
      >
        <StyledBox>
          <ProfitText profit={totalProfit} /> @{' '}
          <HighlightText>{positions?.length || 0}</HighlightText>
        </StyledBox>
      </AppTooltip>

      <TradingStatusValue asTooltip>
        <StyledBox>{labelManualTrading}</StyledBox>
      </TradingStatusValue>

      <PingProbeValue>
        <StyledBox>{labelPingValue}</StyledBox>
      </PingProbeValue>

      <AppTooltip
        title={<AppTrans i18nKey='profits_availableValues_text'></AppTrans>}
      >
        <StyledBox>{availableValueLabel}</StyledBox>
      </AppTooltip>
    </React.Fragment>
  )
}

const StyledBox = styled.span`
  display: inline-block;
  width: 120px;
  background-color: #e1e1e1;
  padding: 4px 12px;
  border: 1px solid #ccc;
  margin-right: -1px;
  line-height: 30px;
  text-align: center;
  font-size: 0.9em;
  height: 40px;
`

export const registeredExecutionDialogStatusInfo = registerReactComponent({
  containerId: 'ExecutionDialogStatusInfo',
  component: <ExecutionDialogStatusInfo />,
  containerConstructor: containerElement => {
    $(containerElement).insertBefore('.execution-head')
  },
  disabled: () => {
    if (isDisabledInProchart()) return true
    if ($(angularAPI.selectors.dialogPriceDisplayValue).length < 1) return true
    return false
  },
})

GM.addStyle(`
  [id^=uidialog] #${registeredExecutionDialogStatusInfo.container.id} {
    display: flex;
  }

  [id^=uidialog] #${registeredExecutionDialogStatusInfo.container.id} .bp3-popover-target {
    border-right: 1px solid #cccccc;
  }
`)
