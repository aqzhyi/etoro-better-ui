import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { angularAPI } from '@/angularAPI'
import {
  dialogSaveAmountToStorage,
  dialogSaveLeverToStorage,
} from '@/components/ExecutionDialog/applyRiskAndAmountSaveToMemory'
import { ExecutionDialogApplyLastOrderSwitch } from '@/components/ExecutionDialog/ExecutionDialogApplyLastOrderSwitch'
import { ProviderBy } from '@/components/ProviderBy'
import { gaAPI, GaEventId } from '@/gaAPI'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { currencyTextToNumber } from '@/utils/currencyTextToNumber'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { PrimaryButton, Stack } from '@fluentui/react'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import Tooltip from 'rc-tooltip'
import React, { useEffect } from 'react'
import { useTimeoutFn } from 'react-use'
import { storage } from '@/storage'

const toAmount = (value: number) => {
  const inputEl = $(angularAPI.selectors.dialogAmountInput)

  inputEl
    .trigger('focus')
    .val(`${value}`)
    .delay(50)
    .trigger('change')
    .delay(50)
    .trigger('blur')

  dialogSaveAmountToStorage(value)
}

const toLever = (value: number) => {
  const tabEl = $(
    angularAPI.selectors.dialogLeverLevelDisplayText,
  ).parentsUntil('a')

  tabEl.trigger('click')

  $(`.risk-itemlevel:contains(" x${value} ")`).trigger('click')

  dialogSaveLeverToStorage(value)
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

  const [amountIsReady, amountCancel, amountReset] = useTimeoutFn(() => {
    if (!executionUseApplyLast) {
      return amountCancel()
    }

    if (amountIsReady()) {
      toAmount(lastApplied.amount)
    }

    const currentAmount = currencyTextToNumber(
      $(angularAPI.selectors.dialogAmountInput).val()?.toString(),
    )

    if (currentAmount === lastApplied.amount) {
      amountCancel()
    } else {
      amountReset()
    }
  }, 50)

  useTimeoutFn(() => {
    amountCancel()
  }, 1000)

  const [leverIsReady, leverCancel, leverReset] = useTimeoutFn(() => {
    if (!executionUseApplyLast) {
      return leverCancel()
    }

    if (leverIsReady()) {
      toLever(lastApplied.lever)
    }

    const currentLever = currencyTextToNumber(
      $(angularAPI.selectors.dialogLeverLevelDisplayText)
        .get(0)
        .innerText.trim()
        .replace(/x/i, ''),
    )

    if (currentLever === lastApplied.lever) {
      leverCancel()
    } else {
      leverReset()
    }
  }, 50)

  useTimeoutFn(() => {
    leverCancel()
  }, 1000)

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
