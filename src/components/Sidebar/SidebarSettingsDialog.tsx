import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import { toggleSettingsDialog } from '~/actions/toggleSettingsDialog'
import { ExecutionDialogFixedAmountLeverToggle } from '~/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { PingProbeHiddenSetup } from '~/components/PingProbeHiddenSetup'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { SettingAmountsButton } from '~/components/SettingAmountsButton'
import { SettingSelectedExchange } from '~/components/SettingSelectedExchange'
import { UniversalHotkeySettings } from '~/components/UniversalControl/UniversalHotkeySettings'
import { WatchlistCompactSwitch } from '~/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '~/components/Watchlist/WatchlistInvestedSwitch'
import { getMYR, getNTD } from '~/exchange'
import { gaAPI, GaEventId } from '~/gaAPI'
import { usePrimaryTranslation } from '~/hooks/usePrimaryTranslation'
import { AttributeFreepik } from '~/Icons/AttributeFreepik'
import { BetterEtoroUIConfig } from '~/storage'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const SidebarSettingsDialog: React.FC = () => {
  const locale = usePrimaryTranslation()
  const dispatch = useAppDispatch()

  const settings = useAppSelector(state => state.settings)
  const dialogOpen = useAppSelector(
    state => state.display.betterEtoroUISettingsDialog,
  )

  return (
    <Dialog
      maxWidth='md'
      onClose={() => {
        dispatch(toggleSettingsDialog(false))
      }}
      open={dialogOpen}
    >
      <DialogTitle>
        <PrimaryTrans i18nKey='universal_extensionName_text'></PrimaryTrans>
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
              label={
                <PrimaryTrans i18nKey='dialog_enabled_brief'></PrimaryTrans>
              }
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
                      <PrimaryTrans
                        i18nKey='universal_doChanged_text'
                        values={{
                          text: String(checked),
                        }}
                      ></PrimaryTrans>,
                      { position: 'bottom-left' },
                    )
                  }}
                ></Switch>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label={
                <PrimaryTrans i18nKey='dialog_enabledInProchart_brief'></PrimaryTrans>
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
              label={
                <PrimaryTrans i18nKey='dialog_buttonsSetup_brief'></PrimaryTrans>
              }
              labelPlacement='top'
              control={<SettingAmountsButton />}
            ></FormControlLabel>
          </Grid>

          <Grid item>
            <ExecutionDialogFixedAmountLeverToggle />
          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <FormControlLabel
                label={
                  <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_brief'></PrimaryTrans>
                }
                control={
                  <Switch
                    checked={settings.stopLossAndTakeProfitUseLastPercent}
                    onChange={(event, enabled) => {
                      dispatch(
                        setBetterEtoroUIConfig({
                          stopLossAndTakeProfitUseLastPercent: enabled,
                        }),
                      )
                    }}
                  ></Switch>
                }
              ></FormControlLabel>
            </Grid>

            <Grid item xs={3}>
              <PrimaryTooltip
                title={
                  <PrimaryTrans
                    i18nKey='profits_fixedStopLossValueOnOrder_help'
                    values={{
                      value: settings.stopLossLastPercent,
                    }}
                  ></PrimaryTrans>
                }
              >
                <TextField
                  variant='outlined'
                  label={
                    <PrimaryTrans
                      i18nKey='profits_fixedStopLossValueOnOrder_brief'
                      values={{
                        value: settings.stopLossLastPercent,
                      }}
                    ></PrimaryTrans>
                  }
                  defaultValue={String(settings.stopLossLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== settings.stopLossLastPercent
                    ) {
                      toast.success(
                        <PrimaryTrans
                          i18nKey='universal_doChanged_text'
                          values={{
                            text: `${newValue}%`,
                          }}
                        ></PrimaryTrans>,
                      )

                      dispatch(
                        setBetterEtoroUIConfig({
                          stopLossLastPercent: newValue,
                        }),
                      )
                    }
                  }}
                ></TextField>
              </PrimaryTooltip>
            </Grid>

            <Grid item xs={3}>
              <PrimaryTooltip
                title={
                  <PrimaryTrans
                    i18nKey='profits_fixedTakeProfitValueOnOrder_help'
                    values={{
                      value: settings.takeProfitLastPercent,
                    }}
                  ></PrimaryTrans>
                }
              >
                <TextField
                  variant='outlined'
                  label={
                    <PrimaryTrans
                      i18nKey='profits_fixedTakeProfitValueOnOrder_brief'
                      values={{
                        value: settings.takeProfitLastPercent,
                      }}
                    ></PrimaryTrans>
                  }
                  defaultValue={String(settings.takeProfitLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== settings.takeProfitLastPercent
                    ) {
                      toast.success(
                        <PrimaryTrans
                          i18nKey='universal_doChanged_text'
                          values={{
                            text: `${newValue}%`,
                          }}
                        ></PrimaryTrans>,
                      )

                      dispatch(
                        setBetterEtoroUIConfig({
                          takeProfitLastPercent: newValue,
                        }),
                      )
                    }
                  }}
                ></TextField>
              </PrimaryTooltip>
            </Grid>
          </Grid>

          <Grid item>
            <UniversalHotkeySettings />
          </Grid>

          <Grid item>
            <PingProbeHiddenSetup />
          </Grid>

          <Grid item container>
            <PrimaryTrans i18nKey='common_experimental_text'></PrimaryTrans>
          </Grid>

          <Grid item container>
            <FormControlLabel
              label={
                <PrimaryTrans i18nKey='dialog_priceRenderRate_brife'></PrimaryTrans>
              }
              labelPlacement='top'
              control={
                <Slider
                  defaultValue={settings.inviteExcitingDegree ?? 0}
                  valueLabelDisplay='auto'
                  valueLabelFormat={value =>
                    value < 15 ? (
                      <PrimaryTrans i18nKey='common_disable_text'></PrimaryTrans>
                    ) : (
                      String(value)
                    )
                  }
                  marks={[
                    {
                      label: (
                        <PrimaryTrans i18nKey='common_disable_text'></PrimaryTrans>
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
                  ]}
                  step={1}
                  min={-15}
                  max={100}
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
                        inviteExcitingDegree: value < 15 ? null : value,
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
            {/* <PrimaryTrans i18nKey='universal_extensionName_text'></PrimaryTrans> */}
            Others
          </Grid>

          <Grid item>
            <PrimaryTooltip
              title={
                <PrimaryTrans i18nKey='universal_compact_brief'></PrimaryTrans>
              }
            >
              <WatchlistCompactSwitch />
            </PrimaryTooltip>
          </Grid>

          <Grid item>
            <PrimaryTooltip
              title={
                <PrimaryTrans i18nKey='profits_invested_brief'></PrimaryTrans>
              }
            >
              <WatchlistInvestedSwitch />
            </PrimaryTooltip>
          </Grid>

          <Grid item>
            <SettingSelectedExchange />
          </Grid>

          <Grid item>
            <FormControlLabel
              label={
                <PrimaryTrans i18nKey='setting_resetAll_text'></PrimaryTrans>
              }
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
                  <PrimaryTrans i18nKey='setting_resetAll_text'></PrimaryTrans>
                </Button>
              }
            ></FormControlLabel>
          </Grid>

          <Grid item>
            <FormControlLabel
              label={
                <PrimaryTrans i18nKey='universal_googleAnalyticsEnabled_brief'></PrimaryTrans>
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
