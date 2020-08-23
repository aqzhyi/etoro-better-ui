import { resetBetterEtoroUIConfig } from '@/actions/resetBetterEtoroUIConfig'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { ExecutionDialogFixedAmountLeverToggle } from '@/components/ExecutionDialog/ExecutionDialogFixedAmountLeverToggle'
import { PrimaryTooltip } from '@/components/PrimaryTooltip'
import { PrimaryTrans } from '@/components/PrimaryTrans'
import { UniversalHotkeySettings } from '@/components/UniversalControl/UniversalHotkeySettings'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { getMYR, getNTD } from '@/exchange'
import { gaAPI, GaEventId } from '@/gaAPI'
import { usePrimaryTranslation } from '@/hooks/usePrimaryTranslation'
import { BetterEtoroUIConfig } from '@/storage'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import {
  ChoiceGroup,
  DefaultButton,
  Dialog,
  Label,
  Slider,
  Stack,
  TextField,
  Toggle,
} from '@fluentui/react'
import toast from 'cogo-toast'
import i18next from 'i18next'
import React, { useEffect } from 'react'

const getArrayNumbers = (values = '200') => values.split(',').map(Number)

export const SidebarSettingsDialog: React.FC = () => {
  const locale = usePrimaryTranslation()
  const dispatch = useAppDispatch()

  const configs = useAppSelector(state => state.settings)
  const dialogOpen = useAppSelector(
    state => state.display.betterEtoroUISettingsDialog,
  )

  const [macroAmountInput, macroAmountInputSetter] = React.useState<
    string | undefined
  >('')

  useEffect(() => {
    macroAmountInputSetter(configs.executionAmount.join(','))
  }, [configs.executionAmount])

  return (
    <Dialog
      title={
        <PrimaryTrans i18nKey='universal_extensionName_text'></PrimaryTrans>
      }
      dialogContentProps={{ showCloseButton: true }}
      minWidth={642}
      onDismiss={() => {
        dispatch(toggleSettingsDialog(false))
      }}
      hidden={!dialogOpen}
    >
      <Stack
        tokens={{ padding: 8, childrenGap: 16 }}
        styles={{ root: { outline: '1px solid #dddddd' } }}
      >
        <Label>Execution Dialog</Label>

        <Stack.Item>
          <Label>
            <PrimaryTrans i18nKey='dialog_enabled_brief'></PrimaryTrans>
          </Label>
          <ChoiceGroup
            options={[
              {
                key: 'ON',
                text: 'ON',
                iconProps: { iconName: 'ActivateOrders' },
                checked: configs.executionMacroEnabled === true,
              },
              {
                key: 'OFF',
                text: 'OFF',
                iconProps: { iconName: 'DeactivateOrders' },
                checked: configs.executionMacroEnabled === false,
              },
            ]}
            onChange={(event, option) => {
              const yourEnabled = option?.key === 'ON' ? true : false

              gaAPI.sendEvent(
                GaEventId.setting_dialogMacroEnabledSet,
                `onOff=${String(yourEnabled)}`,
              )

              dispatch(
                setBetterEtoroUIConfig({
                  executionMacroEnabled: yourEnabled,
                }),
              )

              toast.success(
                <PrimaryTrans
                  i18nKey='universal_doChanged_text'
                  values={{
                    text: String(yourEnabled),
                  }}
                ></PrimaryTrans>,
                { position: 'bottom-left' },
              )
            }}
          ></ChoiceGroup>
        </Stack.Item>

        <Stack.Item>
          <Label>
            <PrimaryTrans i18nKey='dialog_enabledInProchart_brief'></PrimaryTrans>
          </Label>
          <Toggle
            checked={!configs.executionMacroEnabledInProchart}
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
          ></Toggle>
        </Stack.Item>

        <Stack.Item>
          <Label>{locale.t('dialog_buttonsSetup_brief')}</Label>
          <TextField
            value={macroAmountInput}
            onChange={(event, newValue) => {
              macroAmountInputSetter(newValue)
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'enter') {
                dispatch(
                  openPromptForSetMacroAmount(
                    getArrayNumbers(macroAmountInput),
                  ),
                )
              }
            }}
            onBlur={event => {
              dispatch(
                openPromptForSetMacroAmount(getArrayNumbers(macroAmountInput)),
              )
            }}
          ></TextField>
        </Stack.Item>

        <Stack.Item>
          <Label>
            <PrimaryTrans i18nKey='dialog_fixedNextOrderValue_brief'></PrimaryTrans>
          </Label>
          <ExecutionDialogFixedAmountLeverToggle />
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <Stack.Item>
              <Label>
                <PrimaryTrans i18nKey='profits_fixedStopLossTakeProfitEnabled_brief'></PrimaryTrans>
              </Label>
              <Toggle
                checked={configs.stopLossAndTakeProfitUseLastPercent}
                onChange={(event, enabled) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      stopLossAndTakeProfitUseLastPercent: enabled,
                    }),
                  )
                }}
              ></Toggle>
            </Stack.Item>

            <Stack.Item>
              <Label>
                <PrimaryTrans
                  i18nKey='profits_fixedStopLossValueOnOrder_brief'
                  values={{
                    value: configs.stopLossLastPercent,
                  }}
                ></PrimaryTrans>
              </Label>
              <PrimaryTooltip
                overlay={
                  <PrimaryTrans
                    i18nKey='profits_fixedStopLossValueOnOrder_help'
                    values={{
                      value: configs.stopLossLastPercent,
                    }}
                  ></PrimaryTrans>
                }
              >
                <TextField
                  defaultValue={String(configs.stopLossLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== configs.stopLossLastPercent
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
            </Stack.Item>

            <Stack.Item>
              <Label>
                <PrimaryTrans
                  i18nKey='profits_fixedTakeProfitValueOnOrder_brief'
                  values={{
                    value: configs.takeProfitLastPercent,
                  }}
                ></PrimaryTrans>
              </Label>

              <PrimaryTooltip
                overlay={
                  <PrimaryTrans
                    i18nKey='profits_fixedTakeProfitValueOnOrder_help'
                    values={{
                      value: configs.takeProfitLastPercent,
                    }}
                  ></PrimaryTrans>
                }
              >
                <TextField
                  defaultValue={String(configs.takeProfitLastPercent)}
                  onBlur={event => {
                    const newValue = Number(event.target.value)

                    if (
                      !Number.isNaN(newValue) &&
                      newValue !== configs.takeProfitLastPercent
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
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <UniversalHotkeySettings />
        </Stack.Item>

        <Stack.Item>
          <Slider
            label={locale.t('universal_intervalCheckingStatus_brief')}
            min={5}
            max={60 * 5}
            step={1}
            defaultValue={configs.intervalCheckingStatus}
            showValue
            snapToStep
            onChanged={(event, value) => {
              gaAPI.sendEvent(
                GaEventId.setting_intervalCheckingStatus,
                `interval=${value}`,
              )
              dispatch(
                setBetterEtoroUIConfig({
                  intervalCheckingStatus: value,
                }),
              )
            }}
          />
        </Stack.Item>
      </Stack>

      <Stack
        tokens={{ padding: 8, childrenGap: 16 }}
        styles={{ root: { outline: '1px solid #dddddd', marginTop: 16 } }}
      >
        <Label>Others</Label>

        <Stack.Item>
          <React.Fragment>
            <Label>
              <PrimaryTrans i18nKey='universal_compact_brief'></PrimaryTrans>
            </Label>
            <WatchlistCompactSwitch />
          </React.Fragment>
        </Stack.Item>

        <Stack.Item>
          <Label>
            <PrimaryTrans i18nKey='profits_invested_brief'></PrimaryTrans>
          </Label>
          <WatchlistInvestedSwitch />
        </Stack.Item>

        <Stack.Item styles={{ root: { flex: 4 } }}>
          <Label>
            <PrimaryTrans
              i18nKey='exchange_usedSetup_brief'
              values={{
                text: configs.selectedExchange,
              }}
            ></PrimaryTrans>
          </Label>
          <ChoiceGroup
            options={[
              {
                key: 'NTD',
                text: 'NTD',
                iconProps: { iconName: 'AllCurrency' },
                checked: configs.selectedExchange === 'NTD',
              },
              {
                key: 'MYR',
                text: 'MYR',
                iconProps: { iconName: 'AllCurrency' },
                checked: configs.selectedExchange === 'MYR',
              },
              {
                key: 'HIDDEN',
                text: 'HIDDEN',
                iconProps: { iconName: 'Hide' },
                checked: configs.selectedExchange === 'HIDDEN',
              },
            ]}
            onChange={async (event, option) => {
              const loading = toast.loading(
                <PrimaryTrans i18nKey='universal_doChanging_text'></PrimaryTrans>,
                {
                  position: 'bottom-left',
                },
              )

              const youSelected = (option?.key ||
                'NTD') as BetterEtoroUIConfig['selectedExchange']

              gaAPI.sendEvent(
                GaEventId.setting_currencyUseSet,
                `value=${youSelected}`,
              )

              if (youSelected === 'HIDDEN') {
                dispatch(
                  setBetterEtoroUIConfig({
                    selectedExchange: youSelected,
                  }),
                )
              }

              if (youSelected === 'NTD') {
                dispatch(
                  setBetterEtoroUIConfig({
                    NTD: await getNTD(),
                    selectedExchange: youSelected,
                  }),
                )
              }

              if (youSelected === 'MYR') {
                dispatch(
                  setBetterEtoroUIConfig({
                    MYR: await getMYR(),
                    selectedExchange: youSelected,
                  }),
                )
              }

              toast.success(
                <PrimaryTrans
                  i18nKey='universal_doChanged_text'
                  values={{
                    text: youSelected,
                  }}
                ></PrimaryTrans>,
                { position: 'bottom-left' },
              )

              loading.hide?.()
            }}
          />
        </Stack.Item>

        <Stack.Item>
          <Label>
            <PrimaryTrans i18nKey='setting_resetAll_text'></PrimaryTrans>
          </Label>
          <DefaultButton
            iconProps={{ iconName: 'SyncStatusSolid' }}
            onClick={() => {
              const yes = confirm(`${i18next.t('setting_resetAll_text')}, YES?`)

              if (yes) {
                gaAPI.sendEvent(GaEventId.setting_resetAllClick)

                dispatch(resetBetterEtoroUIConfig())
              }
            }}
          ></DefaultButton>
        </Stack.Item>

        <Stack.Item>
          <Toggle
            label={
              <PrimaryTrans i18nKey='universal_googleAnalyticsEnabled_brief'></PrimaryTrans>
            }
            checked={configs.googleAnalyticsEnabled}
            onChange={(event, checked) => {
              dispatch(
                setBetterEtoroUIConfig({
                  googleAnalyticsEnabled: checked,
                }),
              )
            }}
          ></Toggle>
        </Stack.Item>
      </Stack>

      <Stack
        tokens={{ padding: 8, childrenGap: 16 }}
        styles={{ root: { outline: '1px solid #dddddd', marginTop: 16 } }}
      >
        <Label>俱樂部實驗</Label>

        <Stack.Item>
          <Slider
            label={
              '掌聲高聲歡呼之精采程度（請注意健康風險，掌聲過於激烈恐將導致耳朵承受不可逆的傷害）'
            }
            defaultValue={configs.inviteExcitingDegree ?? 0}
            valueFormat={value => (value < 15 ? '停用' : String(value) + 'ms')}
            step={1}
            min={-15}
            max={100}
            snapToStep
            originFromZero
            onChanged={(event, value) => {
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
        </Stack.Item>
      </Stack>
    </Dialog>
  )
}
