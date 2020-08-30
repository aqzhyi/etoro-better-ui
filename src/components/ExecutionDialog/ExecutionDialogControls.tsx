import { openPromptForSetMacroAmount } from '~/actions/setMacroAmount'
import { angularAPI } from '~/angularAPI'
import {
  dialogSaveAmountToStorage,
  dialogSaveLeverToStorage,
} from '~/components/ExecutionDialog/applyRiskAndAmountSaveToMemory'
import { ExecutionDialogFixedAmountLeverToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { ExecutionDialogFixedStopLossTakeProfitToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedStopLossTakeProfitToggle'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'
import { usePrimaryTranslation } from '~/hooks/usePrimaryTranslation'
import { storage } from '~/storage'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useInterval, useTimeoutFn } from 'react-use'
import styled from 'styled-components'
import { Button, Grid } from '@material-ui/core'

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
    const currentLever =
      angularAPI.executionDialogScope?.model?.leverages.selectedLeverage ?? 1

    const etoroMinAmountValue =
      angularAPI.executionDialogScope?.model?.instrument?.MinPositionAmount ??
      value

    const valueWillSetup =
      value * currentLever < etoroMinAmountValue ? etoroMinAmountValue : value

    $(angularAPI.selectors.dialogAmountInput)
      .val(`${valueWillSetup}`)
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
            title={
              <PrimaryTrans i18nKey='dialog_fixedNextOrderValue_brief'></PrimaryTrans>
            }
          >
            {(executionUseApplyLast && <LockIcon />) || <LockOpenIcon />}
          </PrimaryTooltip>
        </StyledFixedTipOnAmountInput>
      </React.Fragment>

      <Grid container direction='column'>
        <Grid item>
          <h2 style={{ textAlign: 'center' }}>
            <PrimaryTrans i18nKey='universal_amount_text'></PrimaryTrans>
          </h2>

          <Grid container direction='column'>
            {amounts.map((value, index) => {
              return (
                <Grid item key={index} style={{ marginBottom: 4 }}>
                  <Button
                    variant={
                      (lastApplied.amount === value && 'contained') ||
                      'outlined'
                    }
                    color='primary'
                    fullWidth
                    size='small'
                    onClick={() => {
                      gaAPI.sendEvent(
                        GaEventId.dialog_amountButtonsClick,
                        `amount=${value}`,
                      )
                      amountView.setVulue(value)
                      dialogSaveAmountToStorage(value)
                    }}
                  >
                    ${value}
                  </Button>
                </Grid>
              )
            })}
          </Grid>
        </Grid>

        <Grid item>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            fullWidth
            onClick={() => {
              gaAPI.sendEvent(GaEventId.dialog_buttonsArrangeClick)
              dispatch(openPromptForSetMacroAmount())
            }}
          >
            <PrimaryTrans i18nKey='common_buttonSetup'></PrimaryTrans>
          </Button>
        </Grid>

        <Grid item>
          <h2 style={{ textAlign: 'center' }}>
            <PrimaryTrans i18nKey='universal_lever_text'></PrimaryTrans>
          </h2>
          <Grid container direction='column'>
            {levers.map((value, index) => {
              return (
                <Grid item key={index} style={{ marginBottom: 4 }}>
                  <Button
                    variant={
                      (lastApplied.lever === value && 'contained') || 'outlined'
                    }
                    color='primary'
                    fullWidth
                    size='small'
                    onClick={() => {
                      gaAPI.sendEvent(
                        GaEventId.dialog_leverButtonsClick,
                        `lever=${value}`,
                      )
                      leverView.setValue(value)
                      dialogSaveLeverToStorage(value)
                    }}
                  >
                    x{value}
                  </Button>
                </Grid>
              )
            })}
          </Grid>
        </Grid>

        <Grid item container justify='center' style={{ width: 100 }}>
          <ExecutionDialogFixedAmountLeverToggle labelPlacement='top' />
        </Grid>

        <Grid item container justify='center' style={{ width: 100 }}>
          <ExecutionDialogFixedStopLossTakeProfitToggle labelPlacement='top' />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const StyledFixedTipOnAmountInput = styled.span`
  position: absolute;
  left: 480px;
  margin-top: 10px;
  z-index: 100000;
  top: ${() => {
    const [px, pxSetter] = useState('auto')
    const magic = 45

    useTimeoutFn(() => {
      const target = String(
        $(angularAPI.selectors.dialogAmountInput).position()?.top - magic,
      )

      pxSetter((target && target + 'px') || '195px')
    }, 1500)

    return px
  }};
`

const StyledContainer = styled.span`
  @media (min-width: 741px) {
    display: inline-block;
    width: 110px;
    margin: 0 auto;
    margin-bottom: 16px;
    text-align: center;
    flex: 0.9;
    /** 避免入金按紐太 width，擋到了下單輔助介面的鼠標點擊 */
    z-index: 1;
    position: absolute;
    margin-left: -110px;
    margin-top: -60px;
    background-color: #fff;
    outline: 1px solid #000;
    padding: 4px;
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
