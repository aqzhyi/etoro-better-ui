import React from 'react'
import ReactDOM from 'react-dom'
import toast from 'cogo-toast'
import { ButtonGroup, Button, Tooltip } from '@blueprintjs/core'
import { storage } from '../../storage'
import store, { useAppSelector, useAppDispatch } from '@/store/_store'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { i18n } from '@/i18n'
import { Toggle } from '@fluentui/react'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { useMount, useEffectOnce, useUpdateEffect } from 'react-use'
import { GM } from '@/GM'
import { Provider } from 'react-redux'
import { debugAPI } from '@/debugAPI'
import { RiskSpecification } from '@/components/RiskSpecification'
import { ProviderBy } from '@/components/ProviderBy'

const toAmount = (value: number) => {
  $('[data-etoro-automation-id="execution-button-switch-to-amount"]').click()

  const inputEl = $(
    '[data-etoro-automation-id="execution-amount-input-section"]',
  ).find('input')

  inputEl.val(`${value}`)
  inputEl.change()
  inputEl.blur()
}

const toLever = (value: number) => {
  const targetTabEl = $(
    '[ng-click="$ctrl.tabsCtrl.selectTab($ctrl, $event)"]',
  ).eq(1)

  const isTarget =
    // 英文
    targetTabEl.text().toLowerCase().includes('leverage') ||
    // 馬來文
    targetTabEl.text().includes('leveraj') ||
    // 中文
    targetTabEl.text().includes('槓桿') ||
    targetTabEl.text().includes('槓杆')

  if (isTarget) {
    // tab 先按下後，等到 ng-if 使元素出現，在 select 按下
    targetTabEl.click()

    $(`.risk-itemlevel:contains(" x${value} ")`).click()
  } else {
    toast.info(<div>{i18n.動作沒有執行()}</div>)
  }
}

/**
 * 下單輔助巨集
 */
export const ExecutionDialogControls = () => {
  const dispatch = useAppDispatch()

  const amounts = useAppSelector(
    state => state.settings.betterEtoroUIConfig.executionAmount,
  )
  const levers = useAppSelector(
    state => state.settings.betterEtoroUIConfig.executionLever,
  )

  const executionUseApplyLast = useAppSelector(
    state => state.settings.betterEtoroUIConfig.executionUseApplyLast,
  )

  const lastApplied = useAppSelector(state => {
    return {
      amount: state.settings.betterEtoroUIConfig.executionAmountLast,
      lever: state.settings.betterEtoroUIConfig.executionLeverLast,
    }
  })

  if (!storage.findConfig().executionMacroEnabled) {
    return null
  }

  React.useEffect(() => {
    toast.warn(
      <span>
        {i18n.確保同意下單巨集風險(() => (
          <RiskSpecification aStyle={{ color: 'blue' }} />
        ))}
      </span>,
      { position: 'top-left' },
    )
  }, [])

  useMount(() => {
    if (executionUseApplyLast) {
      toAmount(lastApplied.amount)
      toLever(lastApplied.lever)
    }
  })

  return (
    <React.Fragment>
      <ProviderBy />

      <React.Fragment>
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ textAlign: 'center' }}>{i18n.金額()}</h2>
          <ButtonGroup fill={true} large={true} vertical={true}>
            {amounts.map((value, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    toAmount(value)
                    dispatch(
                      setBetterEtoroUIConfig({ executionAmountLast: value }),
                    )
                  }}
                  intent='primary'
                >
                  $<span>{value}</span>
                </Button>
              )
            })}
          </ButtonGroup>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button
            icon='settings'
            onClick={() => {
              dispatch(setMacroAmount())
            }}
          >
            {i18n.下單巨集設定按鈕()}
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{ textAlign: 'center' }}>{i18n.槓桿()}</h2>
          <ButtonGroup fill={true} large={true} vertical={true}>
            {levers.map((value, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    toLever(value)
                    dispatch(
                      setBetterEtoroUIConfig({ executionLeverLast: value }),
                    )
                  }}
                  intent='primary'
                >
                  x<span>{value}</span>
                </Button>
              )
            })}
          </ButtonGroup>
        </div>
      </React.Fragment>

      <Tooltip content={i18n.使鎖定下單重複一致之說明()}>
        <Toggle
          checked={executionUseApplyLast}
          label={
            executionUseApplyLast
              ? i18n.使鎖定下單重複一致()
              : i18n.使鎖定下單重複一致否定()
          }
          onChange={(event, checked) => {
            dispatch(
              setBetterEtoroUIConfig({
                executionUseApplyLast: checked,
              }),
            )
          }}
        ></Toggle>
      </Tooltip>
    </React.Fragment>
  )
}

ExecutionDialogControls.isParentReady = () => {
  /** 每日利息說明區塊 */
  const hasDailyValueMessage = !!$(
    '[data-etoro-automation-id="execution-is-refund-daily-value"]',
  )
    .html()
    ?.trim()

  /** 入金按鈕 */
  const hasDepositButton = $(
    '[data-etoro-automation-id="execution-deposit-button"]',
  )
    .html()
    ?.trim()

  /** 以 X1 購買時的股票說明 */
  const hasStockMessage = $(
    '[data-etoro-automation-id="execution-bottom-stock-message"]',
  )
    .html()
    ?.trim()

  // data-etoro-automation-id="execution-bottom-stock-message"
  return (
    !!$('.uidialog').length &&
    (hasDailyValueMessage || hasDepositButton || hasStockMessage)
  )
}

ExecutionDialogControls.isRendered = () =>
  !!$('#ExecutionDialog-ExecutionWrap').html()?.length

ExecutionDialogControls.render = function renderExecutionDialog() {
  if (!storage.findConfig().executionMacroEnabled) {
    return
  }

  if (!ExecutionDialogControls.isParentReady()) {
    return
  }

  if (ExecutionDialogControls.isRendered()) {
    return
  }

  // 確保元素存在，可以加多新介面進去
  $('.uidialog .execution-main').prepend(
    '<div id="ExecutionDialog-ExecutionWrap"></div>',
  )

  $('#ExecutionDialog-ExecutionWrap').length &&
    ReactDOM.render(
      <Provider store={store}>
        <ExecutionDialogControls />
      </Provider>,
      globalThis.document.querySelector('#ExecutionDialog-ExecutionWrap'),
    )

  $('#ExecutionDialog-ExecutionWrap')
    .eq(0)
    .nextAll('#ExecutionDialog-ExecutionWrap')
    .remove()

  debugAPI.dialog('加載完成')
}

GM.addStyle(`
  @media (min-width:741px) {
    .execution-main {
      display: flex;
      justify-content: center;
    }

    #ExecutionDialog-ExecutionWrap {
      margin: 0 auto;
      margin-bottom: 16px;
      text-align: center;
      flex: 0.9;
      /** 避免入金按紐太 width，擋到了下單輔助介面的鼠標點擊 */
      z-index: 1;
    }
  }

  @media (max-width:740px) {
    #ExecutionDialog-ExecutionWrap {
      display: none;
    }
  }
`)
