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
import React, { useEffect } from 'react'
import { useMount } from 'react-use'
import Tooltip from 'rc-tooltip'
import { throttle } from 'lodash'
import { ExecutionDialogApplyLastOrderSwitch } from '@/components/ExecutionDialog/ExecutionDialogApplyLastOrderSwitch'
import { gaAPI, GaEventId } from '@/gaAPI'
import { angularAPI } from '@/angularAPI'
import { currencyTextToNumber } from '@/utils/currencyTextToNumber'

const toAmount = (value: number) => {
  pWaitFor(
    () => {
      return (
        $(angularAPI.selectors.dialogSwitchToAmountButton).length > 0 ||
        $(angularAPI.selectors.dialogSwitchToUnitButton).length > 0
      )
    },
    { timeout: 10000 },
  )
    .then(() => {
      $(angularAPI.selectors.dialogSwitchToAmountButton).trigger('click')

      return pWaitFor(
        () => {
          return $(angularAPI.selectors.dialogAmountInput).length > 0
        },
        { timeout: 10000 },
      )
    })
    .then(() => {
      const inputEl = $(angularAPI.selectors.dialogAmountInput)

      inputEl
        .trigger('focus')
        .val(`${value}`)
        .delay(50)
        .trigger('change')
        .delay(50)
        .trigger('blur')
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        globalThis.setTimeout(() => {
          const currentVal = $(
            angularAPI.selectors.dialogAmountInput,
          ).val() as string

          if (currencyTextToNumber(currentVal) !== value) {
            reject()
          }

          resolve()
        }, 500)
      })
    })
    .catch(() => {
      const { hide } = toast.error(
        <div>{i18n.universal_doAvoid_text(i18n.universal_amount_text())}</div>,
        {
          position: 'bottom-left',
          hideAfter: 8,
          onClick: () => {
            hide?.()
          },
        },
      )
    })
}

const toLever = (value: number) => {
  pWaitFor(
    () => $(angularAPI.selectors.dialogLeverLevelDisplayText).length > 0,
    { timeout: 10000 },
  )
    .then(() => {
      $(angularAPI.selectors.dialogLeverLevelDisplayText).trigger('click')

      return pWaitFor(
        () => $(`.risk-itemlevel:contains(" x${value} ")`).length > 0,
        { timeout: 10000 },
      )
    })
    .then(() => {
      $(`.risk-itemlevel:contains(" x${value} ")`).trigger('click')
    })
    .catch(() => {
      const { hide } = toast.warn(
        <div>{i18n.universal_doAvoid_text(i18n.universal_lever_text())}</div>,
        {
          position: 'bottom-left',
          hideAfter: 8,
          onClick: () => {
            hide?.()
          },
        },
      )
    })
}

const showRiskAgreement = throttle(() => {
  const { hide } = toast.warn(
    <span>
      {i18n.link_riskKnown_text(() => (
        <a
          target='_blank'
          href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3#bce72baccea34ca09f8c3cb2077347d2'
        >
          🔎 🔗 🌐
        </a>
      ))}
    </span>,
    {
      position: 'bottom-left',
      hideAfter: 8,
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

  useEffect(() => {
    showRiskAgreement()
  }, [])

  useMount(() => {
    if (executionUseApplyLast) {
      globalThis.setTimeout(() => {
        toLever(lastApplied.lever)
        toAmount(lastApplied.amount)
      }, 150)
    }
  })

  if (!enabled) {
    return null
  }

  return (
    <React.Fragment>
      <ProviderBy />

      <Stack horizontal={false} tokens={{ childrenGap: 16 }}>
        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>
            {i18n.universal_amount_text()}
          </h2>

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
                {i18n.dialog_buttonsSetup_text()}
              </PrimaryButton>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>{i18n.universal_lever_text()}</h2>
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
                {i18n.dialog_fixedNextOrderValue_brief()}
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
