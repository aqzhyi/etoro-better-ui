import { Grid } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useGetSet, useInterval, useTimeoutFn } from 'react-use'
import styled from 'styled-components'
import { angularAPI } from '~/angularAPI'
import { ExecutionDialogAmountTradeButtonsGrid } from '~/components/ExecutionDialog/ExecutionDialogAmountTradeButtonsGrid'
import { ExecutionDialogFixedAmountLeverToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { ExecutionDialogFixedStopLossTakeProfitToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedStopLossTakeProfitToggle'
import { ExecutionDialogLeverTradeButtonsGrid } from '~/components/ExecutionDialog/ExecutionDialogLeverTradeButtonsGrid'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { storage } from '~/storage'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'

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
  const macroEnabled = useAppSelector(
    state => state.settings.executionMacroEnabled,
  )
  const amountLeverFixedEnabled = useAppSelector(
    state => state.settings.executionUseApplyLast,
  )

  const amountShouldBe = useAppSelector(
    state => state.settings.executionAmountLast,
  )
  const leverShouldBe = useAppSelector(
    state => state.settings.executionLeverLast,
  )

  const [isAmountFixed, setIsAmountFixed] = useGetSet(false)
  const [isLeverFixed, setIsLeverFixed] = useGetSet(false)

  useInterval(
    () => {
      if (!amountLeverFixedEnabled || isAmountFixed()) {
        return
      }

      if (angularAPI.getDialogAmount() !== amountShouldBe) {
        angularAPI.setDialogAmount(amountShouldBe)
      }

      if (angularAPI.getDialogAmount() === amountShouldBe) {
        setIsAmountFixed(true)
      }
    },
    macroEnabled && amountLeverFixedEnabled && !isAmountFixed() ? 500 : null,
  )

  useInterval(
    () => {
      if (!amountLeverFixedEnabled || isLeverFixed()) {
        return
      }

      if (angularAPI.getDialogLever() !== leverShouldBe) {
        angularAPI.setDialogLever(leverShouldBe)
      }

      if (angularAPI.getDialogLever() === leverShouldBe) {
        setIsLeverFixed(true)
      }
    },
    macroEnabled && amountLeverFixedEnabled && !isLeverFixed() ? 500 : null,
  )

  useEffect(() => {
    showRiskAgreement()
  }, [])

  return (
    <React.Fragment>
      <React.Fragment>
        <StyledFixedTipOnAmountInput>
          <PrimaryTooltip
            title={
              <PrimaryTrans i18nKey='dialog_fixedNextOrderValue_brief'></PrimaryTrans>
            }
          >
            {(amountLeverFixedEnabled && <LockIcon />) || <LockOpenIcon />}
          </PrimaryTooltip>
        </StyledFixedTipOnAmountInput>
      </React.Fragment>

      <Grid container direction='column'>
        <Grid item>
          <ExecutionDialogAmountTradeButtonsGrid />
        </Grid>

        <Grid item>
          <ExecutionDialogLeverTradeButtonsGrid />
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
