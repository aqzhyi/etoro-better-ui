import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { angularAPI } from '@/angularAPI'
import {
  dialogSaveAmountToStorage,
  dialogSaveLeverToStorage,
} from '@/components/ExecutionDialog/applyRiskAndAmountSaveToMemory'
import { ExecutionDialogFixedAmountLeverToggle } from '@/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { ExecutionDialogFixedStopLossTakeProfitToggle } from '@/components/ExecutionDialog/ExecutionDialogFixedStopLossTakeProfitToggle'
import { isDisabledInProchart } from '@/components/ExecutionDialog/isDisabledInProchart'
import { PrimaryTooltip } from '@/components/PrimaryTooltip'
import { PrimaryTrans } from '@/components/PrimaryTrans'
import { gaAPI, GaEventId } from '@/gaAPI'
import { GM } from '@/GM'
import { usePrimaryTranslation } from '@/hooks/usePrimaryTranslation'
import { storage } from '@/storage'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { Icon, PrimaryButton, Stack } from '@fluentui/react'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useInterval, useTimeoutFn } from 'react-use'
import styled from 'styled-components'

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

    const isInputFocus = $(angularAPI.selectors.dialogAmountInput).is(':focus')

    if (isInputFocus) {
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
      angularAPI.executionDialogScope?.model?.instrument?.MinPositionAmount ??
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
      $(angularAPI.selectors.dialogLeverLevelDisplayText)
        .html()
        ?.trim()
        // X1 -> 1; X30 -> 30; X100 -> 100
        .slice(1, 100),
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
      angularAPI.executionDialogScope?.model?.instrument?.Leverages

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
      angularAPI.executionDialogScope?.model?.instrument?.Leverages

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
    <PrimaryTrans i18nKey='link_riskKnown_text'></PrimaryTrans>,
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
export const ExecutionDialogControls: React.FC<{
  className?: string
}> = props => {
  const locale = usePrimaryTranslation()

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
      <React.Fragment>
        <StyledFixedTipOnAmountInput>
          <PrimaryTooltip
            overlay={
              <PrimaryTrans i18nKey='dialog_fixedNextOrderValue_brief'></PrimaryTrans>
            }
          >
            {(executionUseApplyLast && (
              <Icon className={props.className} iconName='LockSolid'></Icon>
            )) || (
              <Icon className={props.className} iconName='UnlockSolid'></Icon>
            )}
          </PrimaryTooltip>
        </StyledFixedTipOnAmountInput>
      </React.Fragment>

      <Stack horizontal={false} tokens={{ childrenGap: 16 }}>
        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>
            <PrimaryTrans i18nKey='universal_amount_text'></PrimaryTrans>
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
                <PrimaryTrans i18nKey='common_buttonSetup'></PrimaryTrans>
              </PrimaryButton>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <h2 style={{ textAlign: 'center' }}>
            <PrimaryTrans i18nKey='universal_lever_text'></PrimaryTrans>
          </h2>
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
          <ExecutionDialogFixedAmountLeverToggle />
        </Stack.Item>

        <Stack.Item>
          <ExecutionDialogFixedStopLossTakeProfitToggle />
        </Stack.Item>
      </Stack>
    </React.Fragment>
  )
}

const StyledFixedTipOnAmountInput = styled.span`
  position: absolute;
  left: 425px;
  margin-top: 10px;
  top: ${() => {
    const [px, pxSetter] = useState('auto')

    useTimeoutFn(() => {
      const target = String(
        $(angularAPI.selectors.dialogAmountInput).position()?.top,
      )

      pxSetter((target && target + 'px') || '247px')
    }, 1500)

    return px
  }};
`

const StyledContainer = styled.span`
  @media (min-width: 741px) {
    display: inline-block;
    width: 100px;
    margin: 0 auto;
    margin-bottom: 16px;
    text-align: center;
    flex: 0.9;
    /** 避免入金按紐太 width，擋到了下單輔助介面的鼠標點擊 */
    z-index: 1;
  }

  @media (max-width: 740px) {
    display: none;
  }
`

export const registeredExecutionDialogControls = registerReactComponent({
  component: (
    <StyledContainer>
      <ExecutionDialogControls />
    </StyledContainer>
  ),
  containerId: 'ExecutionDialogControls',
  containerConstructor: containerElement => {
    $('.uidialog .execution-main').prepend(containerElement)
  },
  disabled: () => {
    if (!storage.findConfig().executionMacroEnabled) return true
    if (isDisabledInProchart()) return true
    if ($(angularAPI.selectors.dialogPriceDisplayValue).length < 1) return true

    return false
  },
})

GM.addStyle(`
  @media (min-width:741px) {
    [id^=uidialog] .execution-main {
      display: flex;
      justify-content: center;
    }

    [id^=uidialog] .execution-action-button {
      right: 0;
      width: 540px;
      left: auto;
    }
  }
`)
