import { emitter, Events } from '@/emitter'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import store, { useAppSelector } from '@/store/_store'
import { Callout, Tooltip } from '@blueprintjs/core'
import { ProgressIndicator, Spinner } from '@fluentui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

const ELEMENT_ID = 'execution-dialog-status-info'
const ELEMENT_ID_ROOT = 'execution-dialog-status-info-root'

export const ExecutionDialogStatusInfoRootElement = $(
  `<span id="${ELEMENT_ID_ROOT}"></span>`,
)

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
    <span id={ELEMENT_ID}>
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
    </span>
  )
}

ExecutionDialogStatusInfo.hasRendered = () => !!$(`#${ELEMENT_ID}`).length

ExecutionDialogStatusInfo.render = function renderExecutionDialogStatusInfo() {
  if (ExecutionDialogStatusInfo.hasRendered()) {
    return
  }

  if (!$(`#${ELEMENT_ID_ROOT}`).length) {
    ExecutionDialogStatusInfoRootElement.insertBefore('.execution-head')
  }

  $(`#${ELEMENT_ID_ROOT}`).length &&
    ReactDOM.render(
      <Provider store={store}>
        <ExecutionDialogStatusInfo />
      </Provider>,
      ExecutionDialogStatusInfoRootElement.get(0),
    )
}

GM.addStyle(`
  #${ELEMENT_ID_ROOT} {
    display: flex;
    align-items: flex-start;
  }

  #${ELEMENT_ID_ROOT} .bp3-popover-target {
    border-right: 1px solid #cccccc;
  }

  /** 因為加高了視窗，為了放置額外資訊 */
  .uidialog-content .execution {
    height: 775px;
  }
`)

emitter.on(
  Events.onDialogNotFount,
  function unmountExecutionDialogStatusInfo() {
    // setTimeout 能防止奇怪的 error
    globalThis.setTimeout(() => {
      ReactDOM.unmountComponentAtNode(
        ExecutionDialogStatusInfoRootElement.get(0),
      )
    })
  },
)
