import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { angularAPI } from '@/angularAPI'
import {
  dialogSaveAmountToStorage,
  dialogSaveLeverToStorage,
} from '@/components/ExecutionDialog/applyRiskAndAmountSaveToMemory'
import { ExecutionDialogFixedAmountLever } from '@/components/ExecutionDialog/ExecutionDialogFixedAmountLever'
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
import { useInterval, useTimeoutFn } from 'react-use'
import { storage } from '@/storage'

const useAmountView = () => {
  const amountExpectFixedAt = useAppSelector(
    state => state.settings.executionAmountLast,
  )

  /**
    Is the amount of value it has possibles which can be fixed by function?
  */
  const isAmountCanFixes = () => {
    if (!angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen) {
      return false
    }

    if (amountExpectFixedAt === getAmountViewValue()) {
      return false
    }

    return true
  }

  const isAmountFixed = () => getAmountViewValue() === amountExpectFixedAt

  const getAmountViewValue = () => {
    return Number(
      $(angularAPI.selectors.dialogAmountInput)
        .val()
        ?.toString()
        ?.replace(/[$,]/gi, '')
        .trim(),
    )
  }

  const setAmountViewValue = (value: number) => {
    const etoroMinAmountValue =
      angularAPI.executionDialogScope?.model.instrument?.MinPositionAmount ??
      value

    $(angularAPI.selectors.dialogAmountInput)
      .val(`${value < etoroMinAmountValue ? etoroMinAmountValue : value}`)
      .delay(50)
      .trigger('change')
      .delay(50)
      .trigger('blur')
  }

  return {
    getValue: getAmountViewValue,
    setVulue: setAmountViewValue,
    isFixed: isAmountFixed,
    isCanFixes: isAmountCanFixes,
  }
}

const useLeverView = () => {
  const leverExpectFixedAt = useAppSelector(
    state => state.settings.executionLeverLast,
  )

  const getLeverViewValue = () => {
    const value = Number(
      $(angularAPI.selectors.dialogLeverLevelDisplayText).html()?.trim()[1],
    )

    if (Number.isInteger(value)) {
      return value
    }

    return null
  }

  const setLeverViewValue = (value: number) => {
    const tabEl = $(
      angularAPI.selectors.dialogLeverLevelDisplayText,
    ).parentsUntil('a')

    tabEl.trigger('click')

    $(`.risk-itemlevel:contains(" x${value} ")`).trigger('click')
  }

  const isLeverFixed = () => {
    const availableValues =
      angularAPI.executionDialogScope?.model.instrument?.Leverages

    const currentValue = getLeverViewValue()

    if (!currentValue) {
      return false
    }

    if (currentValue === leverExpectFixedAt) {
      return true
    }

    if (!availableValues?.includes(currentValue) && currentValue === 1) {
      return true
    }

    return false
  }

  const isLeverCanFixes = () => {
    if (!angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen) {
      return false
    }

    const availableValues =
      angularAPI.executionDialogScope?.model.instrument?.Leverages

    if (!availableValues) {
      return false
    }

    const currentValue = getLeverViewValue()

    if (currentValue === leverExpectFixedAt) {
      return false
    }

    const tabEl = $(
      angularAPI.selectors.dialogLeverLevelDisplayText,
    ).parentsUntil('a')

    return !!tabEl.length
  }

  return {
    getValue: getLeverViewValue,
    setValue: setLeverViewValue,
    isFixed: isLeverFixed,
    isCanFixes: isLeverCanFixes,
  }
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

  const amountView = useAmountView()
  const leverView = useLeverView()

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

  useInterval(
    () => {
      if (amountView.isCanFixes()) {
        amountView.setVulue(lastApplied.amount)
      }
    },
    executionUseApplyLast ? 200 : null,
  )

  useInterval(
    () => {
      if (leverView.isCanFixes()) {
        leverView.setValue(lastApplied.lever)
      }
    },
    executionUseApplyLast ? 200 : null,
  )

  useEffect(() => {
    showRiskAgreement()
  }, [])

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
                      amountView.setVulue(value)
                      dialogSaveAmountToStorage(value)
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
                      leverView.setValue(value)
                      dialogSaveLeverToStorage(value)
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
          <ExecutionDialogFixedAmountLever />
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
