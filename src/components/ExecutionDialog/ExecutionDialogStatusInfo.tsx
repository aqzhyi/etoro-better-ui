import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { useAppSelector } from '@/store/_store'
import { ProgressIndicator, Spinner } from '@fluentui/react'
import React, { useMemo, useState } from 'react'
import { registerReactComponent } from '@/utils/registerReactComponent'
import Tooltip from 'rc-tooltip'
import { angularAPI, Position } from '@/angularAPI'
import { TooltipHighlightText } from '@/components/TooltipHighlightText'
import { ProfitText } from '@/components/ProfitText'
import { useInterval } from 'react-use'

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
      <Spinner label='testing...' labelPosition='right' />
    )

  /** 可用餘額 */
  const labelPingValue =
    statusPingValue > 0 ? (
      `${statusPingValue}ms`
    ) : (
      <Spinner label='inferring...' labelPosition='right' />
    )

  const [positions, positionsSetter] = useState<Position[]>([])

  useInterval(() => {
    const items = angularAPI.$rootScope?.session.user.portfolio.manualPositions?.filter(
      position =>
        position.Instrument.DisplayName ===
        angularAPI.executionDialogScope?.controller.instrument?.DisplayName,
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
    return angularAPI.executionDialogScope?.controller.instrument?.Name
  }, [positions])

  /** from etoro html element */
  const canUseValue =
    angularAPI.$rootScope?.session.user.portfolio.availibleToTrade || 0
  const availableValueLabel = `$${canUseValue.toFixed(2)}`

  return (
    <React.Fragment>
      <Tooltip
        placement='top'
        overlay={() => (
          <span>{i18n.profits_selectedObjective_brief(instrumentName)}</span>
        )}
      >
        <span className='indicator-callout-box'>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={
              <span>
                <ProfitText profit={totalProfit} /> @{' '}
                <TooltipHighlightText>
                  {positions?.length || 0}
                </TooltipHighlightText>
              </span>
            }
          />
        </span>
      </Tooltip>

      <Tooltip
        placement='top'
        overlay={() => (
          <span>
            Manual Trading Status{' '}
            <a
              style={{ color: 'blue' }}
              href='https://status.etoro.com/'
              target='_blank'
            >
              (Ref)
            </a>
          </span>
        )}
      >
        <span className='indicator-callout-box'>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={labelManualTrading}
          />
        </span>
      </Tooltip>

      <Tooltip placement='top' overlay={i18n.status_inferringDelay_text()}>
        <span className='indicator-callout-box'>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={labelPingValue}
          />
        </span>
      </Tooltip>

      <Tooltip
        placement='top'
        overlay={<span>{i18n.profits_availableValues_text()}</span>}
      >
        <span className='indicator-callout-box'>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={availableValueLabel}
          />
        </span>
      </Tooltip>
    </React.Fragment>
  )
}

export const registeredExecutionDialogStatusInfo = registerReactComponent({
  containerId: 'ExecutionDialogStatusInfo',
  component: <ExecutionDialogStatusInfo />,
  containerConstructor: containerElement => {
    $(containerElement).insertBefore('.execution-head')
  },
})

GM.addStyle(`
  #${registeredExecutionDialogStatusInfo.container.id} {
    display: flex;
    align-items: flex-start;
  }

  #${registeredExecutionDialogStatusInfo.container.id} .bp3-popover-target {
    border-right: 1px solid #cccccc;
  }

  #${registeredExecutionDialogStatusInfo.container.id} .indicator-callout-box {
    display: inline-block;
    width: 120px;
    background-color: rgb(235, 235, 235);
    padding: 4px 12px;
    border: 1px solid rgb(204, 204, 204);
    margin-right: -1px;
  }

  /** 因為加高了視窗，為了放置額外資訊 */
  .uidialog-content .execution {
    height: 755px;
  }
`)
