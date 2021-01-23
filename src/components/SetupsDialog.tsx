import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  TextField,
} from '@material-ui/core'
import toast from 'cogo-toast'
import i18next from 'i18next'
import React from 'react'
import { resetBetterEtoroUIConfig } from '~/actions/resetBetterEtoroUIConfig'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { ExecutionDialogFixedAmountLeverToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { PingProbeHiddenSetup } from '~/components/PingProbeHiddenSetup'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { SettingAmountsButton } from '~/components/SettingAmountsButton'
import { SettingDemoMode } from '~/components/SettingDemoMode'
import { SettingSelectedExchange } from '~/components/SettingSelectedExchange'
import { UniversalHotkeySettings } from '~/components/UniversalHotkeySettings'
import { WatchlistCompactSwitch } from '~/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '~/components/Watchlist/WatchlistInvestedSwitch'
import { getMYR, getNTD } from '~/exchange'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppTranslation } from '~/hooks/useAppTranslation'
import { AttributeFreepik } from '~/Icons/AttributeFreepik'
import { BetterEtoroUIConfig } from '~/storage'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const SetupsDialog: React.FC = () => {
  const locale = useAppTranslation()
  const dispatch = useAppDispatch()

  const settings = useAppSelector(state => state.settings)
  const dialogOpen = useAppSelector(state => state.display.setupDialog)

  return (
    <Dialog
      maxWidth='md'
      onClose={() => {
        dispatch(toggleSetupDialog(false))
      }}
      hidden={!dialogOpen}
      open
    >
      <DialogTitle>
        <AppTrans i18nKey='universal_extensionName_text'></AppTrans>
      </DialogTitle>

      <DialogContent>
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='flex-start'
          spacing={2}
        >
          <Grid item container>
            Execution Dialog
          </Grid>

          <Grid item>
            <FormControlLabel
              label={<AppTrans i18nKey='dialog_enabled_brief'></AppTrans>}
              labelPlacement='end'
              control={
                <Switch
                  checked={settings.executionMacroEnabled}
                  onChange={(event, checked) => {
                    gaAPI.sendEvent(
                      GaEventId.setting_dialogMacroEnabledSet,
                      `onOff=${String(checked)}`,
                    )

                    dispatch(
                      setBetterEtoroUIConfig({
                        executionMacroEnabled: checked,
                      }),
                    )

                    toast.success(
                      <AppTrans
                        i18nKey='universal_doChanged_text'
                        values={{
                          text: String(checked),
                        }}
                      ></AppTrans>,
                      { position: 'top-right' },
                    )
                  }}
                ></Switch>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label={
                <AppTrans i18nKey='dialog_enabledInProchart_brief'></AppTrans>
              }
              control={
                <Switch
                  checked={!settings.executionMacroEnabledInProchart}
                  onChange={(event, enabled) => {
                    gaAPI.sendEvent(
                      GaEventId.setting_dialogEnabledOnProchartSet,
                      `enabled=${String(enabled)}`,
                    )

                    dispatch(
                      setBetterEtoroUIConfig({
                        executionMacroEnabledInProchart: !enabled,
                      }),
                    )
                  }}
                ></Switch>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label={<AppTrans i18nKey='dialog_buttonsSetup_brief'></AppTrans>}
              labelPlacement='top'
              control={<SettingAmountsButton />}
            ></FormControlLabel>
          </Grid>

          <Grid item>
            <ExecutionDialogFixedAmountLeverToggle />
          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs={3}>
              <AppTooltip
                title={
                  <AppTrans
                    i18nKey='profits_fixedStopLossValueOnOrder_help'
                    values={{
                      value: settings.stopLossLastPercent,
                    }}
                  ></AppTrans>
                }
              >
                <TextField
                  variant='outlined'
                  label={
                    <AppTrans
                      i18nKey='profits_fixedStopLossValueOnOrder_brief'
                      values={{
                        value: settings.stopLossLastPercent,
                      }}
                    ></AppTrans>
                  }
                  defaultValue={String(settings.stopLossLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== settings.stopLossLastPercent
                    ) {
                      toast.success(
                        <AppTrans
                          i18nKey='universal_doChanged_text'
                          values={{
                            text: `${newValue}%`,
                          }}
                        ></AppTrans>,
                      )

                      dispatch(
                        setBetterEtoroUIConfig({
                          stopLossLastPercent: newValue,
                        }),
                      )
                    }
                  }}
                ></TextField>
              </AppTooltip>
            </Grid>

            <Grid item xs={3}>
              <AppTooltip
                title={
                  <AppTrans
                    i18nKey='profits_fixedTakeProfitValueOnOrder_help'
                    values={{
                      value: settings.takeProfitLastPercent,
                    }}
                  ></AppTrans>
                }
              >
                <TextField
                  variant='outlined'
                  label={
                    <AppTrans
                      i18nKey='profits_fixedTakeProfitValueOnOrder_brief'
                      values={{
                        value: settings.takeProfitLastPercent,
                      }}
                    ></AppTrans>
                  }
                  defaultValue={String(settings.takeProfitLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== settings.takeProfitLastPercent
                    ) {
                      toast.success(
                        <AppTrans
                          i18nKey='universal_doChanged_text'
                          values={{
                            text: `${newValue}%`,
                          }}
                        ></AppTrans>,
                      )

                      dispatch(
                        setBetterEtoroUIConfig({
                          takeProfitLastPercent: newValue,
                        }),
                      )
                    }
                  }}
                ></TextField>
              </AppTooltip>
            </Grid>

            <Grid item xs={6}>
              <FormLabel>
                <AppTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_brief'></AppTrans>
              </FormLabel>
            </Grid>
          </Grid>

          <Grid item>
            <UniversalHotkeySettings />
          </Grid>

          <Grid item>
            <PingProbeHiddenSetup />
          </Grid>

          <Grid item container>
            <AppTrans i18nKey='bidask'></AppTrans>
          </Grid>

          <Grid item container>
            <FormControlLabel
              label={
                <AppTrans i18nKey='dialog_priceRenderRate_brife'></AppTrans>
              }
              labelPlacement='top'
              control={
                <Slider
                  defaultValue={settings.tradeDialogPriceRenderRate ?? 0}
                  valueLabelDisplay='auto'
                  valueLabelFormat={value =>
                    value < 15 ? (
                      <AppTrans i18nKey='common_disable_text'></AppTrans>
                    ) : (
                      String(value)
                    )
                  }
                  marks={[
                    {
                      label: (
                        <AppTrans i18nKey='common_disable_text'></AppTrans>
                      ),
                      value: 15,
                    },
                    {
                      label: '50ms',
                      value: 50,
                    },
                    {
                      label: '75ms',
                      value: 75,
                    },
                    {
                      label: '100ms',
                      value: 100,
                    },
                    {
                      label: '500ms',
                      value: 500,
                    },
                  ]}
                  step={1}
                  min={-15}
                  max={500}
                  onChangeCommitted={(event, value) => {
                    if (Array.isArray(value)) {
                      return
                    }

                    gaAPI.sendEvent(
                      GaEventId.setting_inviteExcitingDegree,
                      `value=${value}`,
                    )

                    dispatch(
                      setBetterEtoroUIConfig({
                        tradeDialogPriceRenderRate: value < 15 ? null : value,
                      }),
                    )
                  }}
                ></Slider>
              }
              style={{
                width: '100%',
                alignItems: 'start',
              }}
            ></FormControlLabel>
          </Grid>

          <Grid item>
            {/* <AppTrans i18nKey='universal_extensionName_text'></AppTrans> */}
            Others
          </Grid>

          <Grid container item>
            <Grid item>
              <SettingDemoMode />
            </Grid>
            <Grid item>
              <FormLabel>
                <AppTrans i18nKey='setting_demoMode_brief'></AppTrans>
              </FormLabel>
            </Grid>
          </Grid>

          <Grid item>
            <AppTooltip
              title={<AppTrans i18nKey='universal_compact_brief'></AppTrans>}
            >
              <WatchlistCompactSwitch />
            </AppTooltip>
          </Grid>

          <Grid item>
            <AppTooltip
              title={<AppTrans i18nKey='profits_invested_brief'></AppTrans>}
            >
              <WatchlistInvestedSwitch />
            </AppTooltip>
          </Grid>

          <Grid item>
            <SettingSelectedExchange />
          </Grid>

          <Grid item>
            <FormControlLabel
              label={<AppTrans i18nKey='setting_resetAll_text'></AppTrans>}
              labelPlacement={'top'}
              control={
                <Button
                  variant='outlined'
                  onClick={() => {
                    const yes = confirm(
                      `${i18next.t('setting_resetAll_text')}, YES?`,
                    )

                    if (yes) {
                      gaAPI.sendEvent(GaEventId.setting_resetAllClick)

                      dispatch(resetBetterEtoroUIConfig())
                    }
                  }}
                >
                  <AppTrans i18nKey='setting_resetAll_text'></AppTrans>
                </Button>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item>
            <FormControlLabel
              label={
                <AppTrans i18nKey='universal_googleAnalyticsEnabled_brief'></AppTrans>
              }
              control={
                <Switch
                  checked={settings.googleAnalyticsEnabled}
                  onChange={(event, checked) => {
                    dispatch(
                      setBetterEtoroUIConfig({
                        googleAnalyticsEnabled: checked,
                      }),
                    )
                  }}
                ></Switch>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item>
            <AttributeFreepik />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
