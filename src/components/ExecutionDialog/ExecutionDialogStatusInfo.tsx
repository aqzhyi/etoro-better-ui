import { GM } from '@/GM'
import { i18n } from '@/i18n'
import store, { useAppSelector } from '@/store/_store'
import { ProgressIndicator, Spinner } from '@fluentui/react'
import React from 'react'
import { Provider } from 'react-redux'
import { stickReactComponent } from '@/utils/stickReactComponent'
import Tooltip from 'rc-tooltip'
import { angularAPI } from '@/angularAPI'

export const ExecutionDialogStatusInfo = () => {
  const statusInfo = useAppSelector(state => state.settings.statusInfoAggregate)

  /** 推測延遲 */
  const statusPingValue = useAppSelector(state => state.settings.pingValue)

  /** status.etoro.com 目前服務狀況 */
  const labelManualTrading =
    statusInfo['Manual Trading']?.status === 'Operational' ? (
      '👍'
    ) : statusInfo['Manual Trading']?.status === 'Degraded Performance' ? (
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

  /** from etoro html element */
  const canUseValue =
    angularAPI.$rootScope.session.user.portfolio.availibleToTrade
  const availableValueLabel = `$${canUseValue.toFixed(2)}`

  return (
    <React.Fragment>
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

      <Tooltip placement='top' overlay={i18n.大概延遲()}>
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

      <Tooltip placement='top' overlay={i18n.當前可用餘額()}>
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

export const {
  mount: mountExecutionDialogStatusInfo,
  unmount: unmountExecutionDialogStatusInfo,
  containerId: ExecutionDialogStatusInfoId,
} = stickReactComponent({
  containerId: 'ExecutionDialogStatusInfo',
  component: (
    <Provider store={store}>
      <ExecutionDialogStatusInfo />
    </Provider>
  ),
  containerConstructor: containerElement => {
    $(containerElement).insertBefore('.execution-head')
  },
})

GM.addStyle(`
  #${ExecutionDialogStatusInfoId} {
    display: flex;
    align-items: flex-start;
  }

  #${ExecutionDialogStatusInfoId} .bp3-popover-target {
    border-right: 1px solid #cccccc;
  }

  #${ExecutionDialogStatusInfoId} .indicator-callout-box {
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
