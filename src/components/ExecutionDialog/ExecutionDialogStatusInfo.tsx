import { GM } from '@/GM'
import { i18n } from '@/i18n'
import store, { useAppSelector } from '@/store/_store'
import { Callout, Tooltip } from '@blueprintjs/core'
import { ProgressIndicator, Spinner } from '@fluentui/react'
import React from 'react'
import { Provider } from 'react-redux'
import { stickReactComponent } from '@/utils/stickReactComponent'

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
      statusPingValue
    ) : (
      <Spinner label='inferring...' labelPosition='right' />
    )

  /** from etoro html element */
  const availableValue = $(
    `[automation-id="account-balance-availible-unit-value"]`,
  )
    .text()
    .replace(/[A-Za-z].*/i, '')

  return (
    <React.Fragment>
      <Tooltip position='top' content={'source https://status.etoro.com/'}>
        <Callout style={{ width: 120 }}>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={labelManualTrading}
            description='Manual Trading'
          />
        </Callout>
      </Tooltip>

      <Tooltip position='top' content={i18n.大概延遲()}>
        <Callout style={{ width: 120 }}>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={labelPingValue}
            description={i18n.大概延遲()}
          />
        </Callout>
      </Tooltip>

      <Tooltip position='top' content={i18n.當前可用餘額()}>
        <Callout style={{ width: 120 }}>
          <ProgressIndicator
            styles={{
              itemDescription: { textAlign: 'center' },
              itemName: { textAlign: 'center' },
            }}
            label={availableValue}
            description={i18n.當前可用餘額()}
          />
        </Callout>
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

  /** 因為加高了視窗，為了放置額外資訊 */
  .uidialog-content .execution {
    height: 775px;
  }
`)
