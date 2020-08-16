import { resetBetterEtoroUIConfig } from '@/actions/resetBetterEtoroUIConfig'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { openPromptForSetMacroAmount } from '@/actions/setMacroAmount'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { getMYR, getNTD } from '@/exchange'
import { i18n } from '@/i18n'
import { BetterEtoroUIConfig, storage } from '@/storage'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import {
  ChoiceGroup,
  DefaultButton,
  Dialog,
  Label,
  Stack,
  TextField,
  Toggle,
  Slider,
} from '@fluentui/react'
import toast from 'cogo-toast'
import React, { useEffect, createRef } from 'react'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { ExecutionDialogFixedAmountLever } from '@/components/ExecutionDialog/ExecutionDialogFixedAmountLever'
import Tooltip from 'rc-tooltip'
import { gaAPI, GaEventId } from '@/gaAPI'
import { stringify } from 'query-string'
import { UniversalHotkeySettings } from '@/components/UniversalControl/UniversalHotkeySettings'
import { getInviteCode } from '@/invite/getInviteCode'

const getArrayNumbers = (values = '200') => values.split(',').map(Number)

export const SidebarSettingsDialog: React.FC = () => {
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
      title={i18n.universal_extensionName_text()}
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
          <Label>{i18n.dialog_enabled_brief()}</Label>
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
                i18n.universal_doChanged_text(() => (
                  <span>{JSON.stringify(yourEnabled)}</span>
                )),
                { position: 'bottom-left' },
              )
            }}
          ></ChoiceGroup>
        </Stack.Item>

        <Stack.Item>
          <Label>{i18n.dialog_buttonsSetup_brief()}</Label>
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
          <Label>{i18n.dialog_fixedNextOrderValue_brief()}</Label>
          <ExecutionDialogFixedAmountLever />
        </Stack.Item>

        <Stack.Item>
          <UniversalHotkeySettings />
        </Stack.Item>

        <Stack.Item>
          <Slider
            label={i18n.universal_intervalCheckingStatus_brief()}
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
            <Label>{i18n.universal_compact_brief()}</Label>
            <WatchlistCompactSwitch />
          </React.Fragment>
        </Stack.Item>

        <Stack.Item>
          <Label>{i18n.profits_invested_brief()}</Label>
          <WatchlistInvestedSwitch />
        </Stack.Item>

        <Stack.Item styles={{ root: { flex: 4 } }}>
          <ChoiceGroup
            label={i18n.exchange_usedSetup_brief(configs.selectedExchange)}
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
              const loading = toast.loading(i18n.universal_doChanging_text(), {
                position: 'bottom-left',
              })

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
                i18n.universal_doChanged_text(() => <span>{youSelected}</span>),
                { position: 'bottom-left' },
              )

              loading.hide?.()
            }}
          />
        </Stack.Item>

        <Stack.Item>
          <Label>{i18n.setting_resetAll_text()}</Label>
          <DefaultButton
            iconProps={{ iconName: 'SyncStatusSolid' }}
            onClick={() => {
              const yes = confirm(`${i18n.setting_resetAll_text()}, YES?`)

              if (yes) {
                gaAPI.sendEvent(GaEventId.setting_resetAllClick)

                dispatch(resetBetterEtoroUIConfig())
              }
            }}
          ></DefaultButton>
        </Stack.Item>

        <Stack.Item>
          <Toggle
            label={i18n.universal_googleAnalyticsEnabled_brief()}
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
        <Label>俱樂部</Label>

        <Stack.Item>
          <Slider
            label={
              '掌聲高聲歡呼之精采程度（請注意健康風險，掌聲過於激烈恐將導致耳朵承受不可逆的傷害）'
            }
            value={configs.inviteExcitingDegree ?? 0}
            valueFormat={value => (value < 15 ? '停用' : String(value))}
            step={1}
            min={14}
            max={100}
            onChanged={(event, value) => {
              gaAPI.sendEvent(
                GaEventId.setting_inviteExcitingDegree,
                `value=${value}, code=${String(getInviteCode())}`,
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
