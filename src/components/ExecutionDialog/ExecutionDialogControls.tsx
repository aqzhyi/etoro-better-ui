import { Grid, makeStyles } from '@material-ui/core'
import toast from 'cogo-toast'
import { throttle } from 'lodash'
import React, { memo, useEffect } from 'react'
import { useGetSet, useInterval } from 'react-use'
import { angularAPI } from '~/angularAPI'
import { ExecutionDialogAmountTradeButtonsGrid } from '~/components/ExecutionDialog/ExecutionDialogAmountTradeButtonsGrid'
import { ExecutionDialogFixedAmountLeverToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { ExecutionDialogLeverTradeButtonsGrid } from '~/components/ExecutionDialog/ExecutionDialogLeverTradeButtonsGrid'
import { ExecutionDialogSLTPButtonsGrid } from '~/components/ExecutionDialog/ExecutionDialogSLTPButtonsGrid'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { AppTrans } from '~/components/AppTrans'
import { emitter, Events } from '~/emitter'
import { GM } from '~/GM'
import { storage } from '~/storage'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { ExecutionDialogTradeModeToOrderButton } from '~/components/ExecutionDialog/ExecutionDialogTradeModeToOrderButton'
import { ExecutionDialogTradeModeToTradeButton } from '~/components/ExecutionDialog/ExecutionDialogTradeModeToTradeButton'
import { ExecutionDialogPostions } from '~/components/ExecutionDialog/ExecutionDialogPostions'

const showRiskAgreement = throttle(() => {
  const { hide } = toast.warn(
    <AppTrans i18nKey='link_riskKnown_text'></AppTrans>,
    {
      position: 'top-right',
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
  const isDialogOpen = useAppSelector(
    state => state.display.nativeTradeDialogOpen,
  )
  const macroEnabled = useAppSelector(
    state => state.settings.executionMacroEnabled,
  )
  const css = useStyled({
    open: isDialogOpen,
  })
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
      if (!isDialogOpen) return
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
    isDialogOpen && macroEnabled && amountLeverFixedEnabled && !isAmountFixed()
      ? 500
      : null,
  )

  useInterval(
    () => {
      if (!isDialogOpen) return
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
    isDialogOpen && macroEnabled && amountLeverFixedEnabled && !isLeverFixed()
      ? 500
      : null,
  )

  useEffect(() => {
    showRiskAgreement()
  }, [])

  if (!isDialogOpen) return null

  return (
    <span className={css.root}>
      <Grid item container direction='column' spacing={1}>
        <Grid container item direction='row' justify='space-around' spacing={1}>
          <Grid item>
            <ExecutionDialogAmountTradeButtonsGrid />
          </Grid>

          <Grid item>
            <ExecutionDialogLeverTradeButtonsGrid />
          </Grid>

          <Grid item>
            <ExecutionDialogSLTPButtonsGrid />
          </Grid>
        </Grid>

        <Grid item>
          <ExecutionDialogTradeModeToOrderButton />
        </Grid>

        <Grid item>
          <ExecutionDialogTradeModeToTradeButton />
        </Grid>

        <Grid item>
          <ExecutionDialogFixedAmountLeverToggle labelPlacement='top' />
        </Grid>

        <Grid item>
          <ExecutionDialogPostions />
        </Grid>
      </Grid>
    </span>
  )
}

const useStyled = makeStyles({
  root: {
    '@media(min-width: 741px)': {
      position: 'absolute',
      display: 'inline-block',
      width: 300,
      height: (props: { open: boolean }) => (props.open ? `100vh` : `auto`),
      margin: '0 auto',
      textAlign: 'center',
      zIndex: 10001,
      overflowY: 'scroll',
      backgroundColor: 'white',
      transitionDuration: 1000,
    },
    '@media(max-width: 740px)': {
      display: 'none',
    },
  },
})

const registeredExecutionDialogControls = registerReactComponent({
  component: <ExecutionDialogControls />,
  containerId: ExecutionDialogControls.name,
  containerConstructor: containerElement => {
    $('body').prepend(containerElement)
  },
  disabled: () => {
    if (!storage.findConfig().executionMacroEnabled) return true
    if (isDisabledInProchart()) return true
    if ($(angularAPI.selectors.dialogPriceDisplayValue).length < 1) return true

    return false
  },
})

GM.addStyle(`
  [id^=uidialog] .uidialog-content .execution {
    /** 因為加高了視窗，為了放置額外資訊 */
    height: 755px;

    /** Align to Controls that on window left */
    margin-top: 0;
    left: 300px;
    margin-left: 0;
  }
`)

emitter.on(Events.onDialogHover, registeredExecutionDialogControls.mount)
emitter.on(Events.onDialogNotFound, registeredExecutionDialogControls.unmount)
