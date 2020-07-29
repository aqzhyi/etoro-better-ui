import { storage } from '../../storage'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { ProviderBy } from '@/components/ProviderBy'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { Toggle, Stack, PrimaryButton } from '@fluentui/react'
import toast from 'cogo-toast'
import pWaitFor from 'p-wait-for'
import React from 'react'
import { useMount } from 'react-use'
import Tooltip from 'rc-tooltip'
import { throttle } from 'lodash'
import { ExecutionDialogApplyLastOrderSwitch } from '@/components/ExecutionDialog/ExecutionDialogApplyLastOrderSwitch'
import { gaAPI, GaEventId } from '@/gaAPI'

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

const showRiskAgreement = throttle(() => {
  const { hide } = toast.warn(
    <span>
      {i18n.確保同意下單巨集風險(() => (
        <a
          target='_blank'
          href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3#bce72baccea34ca09f8c3cb2077347d2'
        >
          🔗 🔎 🌐
        </a>
      ))}
    </span>,
    {
      position: 'top-left',
      onClick: () => {
        hide?.()
      },
    },
  )
}, 30000)

/**
 * 下單輔助巨集
 */
export const ExecutionDialogControls = () => {
  const dispatch = useAppDispatch()

  const enabled = useAppSelector(state => state.settings.executionMacroEnabled)

  if (!enabled) {
    return null
  }

  const amounts = useAppSelector(state => state.settings.executionAmount)
  const levers = useAppSelector(state => state.settings.executionLever)

  const executionUseApplyLast = useAppSelector(
    state => state.settings.executionUseApplyLast,
  )

  const lastApplied = useAppSelector(state => {
    return {
      amount: state.settings.executionAmountLast,
      lever: state.settings.executionLeverLast,
    }
  })

  React.useEffect(() => {
    showRiskAgreement()
  }, [])

  useMount(() => {
    if (executionUseApplyLast) {
      pWaitFor(() => {
        return (
          $('[ng-click="$ctrl.tabsCtrl.selectTab($ctrl, $event)"]').length >
            0 &&
          $('[data-etoro-automation-id="execution-amount-input-section"] input')
            .length > 0
        )
      }).then(() => {
        // 在很極端地情況下，連續開開關關 dialog 時，有機會無法正確執行，以 setTimeout 解決
        globalThis.setTimeout(() => {
          toAmount(lastApplied.amount)
          toLever(lastApplied.lever)
        }, 100)
      })
    }
  })

  return (
    <React.Fragment>
      <ProviderBy />

      <Stack horizontal={false} tokens={{ childrenGap: 16 }}>
        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>{i18n.金額()}</h2>

          <Stack horizontal={false} tokens={{ childrenGap: 1 }}>
            {amounts.map((value, index) => {
              return (
                <Stack.Item key={index}>
                  <PrimaryButton
                    onClick={() => {
                      gaAPI.sendEvent(
                        GaEventId.dialog_amountButtonsClick,
                        `amount=${value}`,
                      )
                      toAmount(value)
                      dispatch(
                        setBetterEtoroUIConfig({ executionAmountLast: value }),
                      )
                    }}
                  >
                    $<span>{value}</span>
                  </PrimaryButton>
                </Stack.Item>
              )
            })}
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack>
            <Stack.Item>
              <PrimaryButton
                onClick={() => {
                  gaAPI.sendEvent(GaEventId.dialog_buttonsArrangeClick)
                  dispatch(openPromptForSetMacroAmount())
                }}
              >
                {i18n.下單巨集設定按鈕()}
              </PrimaryButton>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>{i18n.槓桿()}</h2>
          <Stack horizontal={false} tokens={{ childrenGap: 1 }}>
            {levers.map((value, index) => {
              return (
                <Stack.Item key={index}>
                  <PrimaryButton
                    onClick={() => {
                      gaAPI.sendEvent(
                        GaEventId.dialog_leverButtonsClick,
                        `lever=${value}`,
                      )
                      toLever(value)
                      dispatch(
                        setBetterEtoroUIConfig({ executionLeverLast: value }),
                      )
                    }}
                  >
                    x<span>{value}</span>
                  </PrimaryButton>
                </Stack.Item>
              )
            })}
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Tooltip
            placement='left'
            overlay={
              <span style={{ display: 'inline-block', width: 200 }}>
                {i18n.使鎖定下單重複一致之說明()}
              </span>
            }
          >
            <span style={{ display: 'inline-block' }}>
              <ExecutionDialogApplyLastOrderSwitch />
            </span>
          </Tooltip>
        </Stack.Item>
      </Stack>
    </React.Fragment>
  )
}

export const registeredExecutionDialogControls = registerReactComponent({
  component: <ExecutionDialogControls />,
  containerId: 'ExecutionDialogControls',
  containerConstructor: containerElement => {
    $('.uidialog .execution-main').prepend(containerElement)
  },
  disabled: () => !storage.findConfig().executionMacroEnabled,
})

GM.addStyle(`
  @media (min-width:741px) {
    .execution-main {
      display: flex;
      justify-content: center;
    }

    #${registeredExecutionDialogControls.container.id} {
      margin: 0 auto;
      margin-bottom: 16px;
      text-align: center;
      flex: 0.9;
      /** 避免入金按紐太 width，擋到了下單輔助介面的鼠標點擊 */
      z-index: 1;
    }
  }

  @media (max-width:740px) {
    #${registeredExecutionDialogControls.container.id} {
      display: none;
    }
  }
`)
