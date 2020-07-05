import { resetBetterEtoroUIConfig } from '@/actions/resetBetterEtoroUIConfig'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setTabKeyBuySell } from '@/actions/setTabKeyBuySell'
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
} from '@fluentui/react'
import toast from 'cogo-toast'
import React, { useEffect } from 'react'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { ExecutionDialogApplyLastOrderSwitch } from '@/components/ExecutionDialog/ExecutionDialogApplyLastOrderSwitch'

const getArrayNumbers = (values = '200') => values.split(',').map(Number)

export const SidebarSettingsDialog: React.FC = () => {
  const dispatch = useAppDispatch()

  const configs = useAppSelector(state => state.settings.betterEtoroUIConfig)
  const dialogOpen = useAppSelector(
    state => state.settings.betterEtoroUISettingsDialog,
  )

  const [macroAmountInput, macroAmountInputSetter] = React.useState<
    string | undefined
  >('')

  useEffect(() => {
    macroAmountInputSetter(configs.executionAmount.join(','))
  }, [configs.executionAmount])

  return (
    <Dialog
      title={i18n.腳本標題()}
      dialogContentProps={{ showCloseButton: true }}
      minWidth={642}
      onDismiss={() => {
        dispatch(toggleSettingsDialog(false))
      }}
      hidden={!dialogOpen}
    >
      <Stack tokens={{ padding: 8, childrenGap: 16 }}>
        <Stack.Item>
          <TextField
            label={i18n.下單巨集金額設定()}
            value={macroAmountInput}
            onChange={(event, newValue) => {
              macroAmountInputSetter(newValue)
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'enter') {
                dispatch(setMacroAmount(getArrayNumbers(macroAmountInput)))
              }
            }}
            onBlur={event => {
              dispatch(setMacroAmount(getArrayNumbers(macroAmountInput)))
            }}
          ></TextField>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal disableShrink tokens={{ childrenGap: 16 }}>
            <Stack.Item styles={{ root: { flex: 4 } }}>
              <Label>{i18n.使鎖定下單重複一致之說明()}</Label>
              <ExecutionDialogApplyLastOrderSwitch />
            </Stack.Item>
            <Stack.Item styles={{ root: { flex: 4 } }}> </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal disableShrink tokens={{ childrenGap: 16 }}>
            <Stack.Item styles={{ root: { flex: 4 } }}>
              <ChoiceGroup
                label={i18n.使下單視窗能夠單鍵快速切換買賣()}
                options={[
                  {
                    key: 'ON',
                    text: 'ON',
                    iconProps: { iconName: 'KeyboardClassic' },
                    checked: configs.useTabKeyBuySell === true,
                  },
                  {
                    key: 'OFF',
                    text: 'OFF',
                    iconProps: { iconName: 'Cancel' },
                    checked: configs.useTabKeyBuySell === false,
                  },
                ]}
                onChange={async (event, option) => {
                  await dispatch(
                    setTabKeyBuySell(option?.key === 'ON' ? true : false),
                  )
                }}
              ></ChoiceGroup>
            </Stack.Item>

            <Stack.Item styles={{ root: { flex: 4 } }}>
              <React.Fragment>
                <Label>{i18n.使緊湊之說明()}</Label>
                <WatchlistCompactSwitch />
              </React.Fragment>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal disableShrink tokens={{ childrenGap: 16 }}>
            <Stack.Item styles={{ root: { flex: 4 } }}>
              <ChoiceGroup
                label={i18n.下單巨集啟用狀態()}
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

                  dispatch(
                    setBetterEtoroUIConfig({
                      executionMacroEnabled: yourEnabled,
                    }),
                  )

                  storage.saveConfig({ executionMacroEnabled: yourEnabled })

                  toast.success(
                    i18n.設定已變更(() => (
                      <span>{JSON.stringify(yourEnabled)}</span>
                    )),
                    { position: 'bottom-left' },
                  )
                }}
              ></ChoiceGroup>
            </Stack.Item>

            <Stack.Item styles={{ root: { flex: 4 } }}>
              <Label>{i18n.使已投資顯示之說明()}</Label>
              <WatchlistInvestedSwitch />
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal disableShrink tokens={{ childrenGap: 16 }}>
            <Stack.Item styles={{ root: { flex: 4 } }}>
              <ChoiceGroup
                label={i18n.設定幣別(configs.selectedExchange)}
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
                  const loading = toast.loading(i18n.設定變更中(), {
                    position: 'bottom-left',
                  })

                  const youSelected = (option?.key ||
                    'NTD') as BetterEtoroUIConfig['selectedExchange']

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
                    i18n.設定已變更(() => <span>{youSelected}</span>),
                    { position: 'bottom-left' },
                  )

                  loading.hide?.()
                }}
              />
            </Stack.Item>

            <Stack.Item verticalFill styles={{ root: { flex: 4 } }}>
              <Label>{i18n.設定重置所有設定()}</Label>
              <DefaultButton
                iconProps={{ iconName: 'SyncStatusSolid' }}
                onClick={() => {
                  const yes = confirm(`${i18n.設定重置所有設定()}, YES?`)

                  if (yes) {
                    dispatch(resetBetterEtoroUIConfig())
                  }
                }}
              ></DefaultButton>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Dialog>
  )
}
