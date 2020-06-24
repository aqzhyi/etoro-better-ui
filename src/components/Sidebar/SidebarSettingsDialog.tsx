import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setMacroEnabled } from '@/actions/setMacroEnabled'
import { emitter, Events } from '@/emitter'
import { exchange, getMYR, getNTD } from '@/exchange'
import { i18n } from '@/i18n'
import { storage } from '@/storage'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { Dialog } from '@blueprintjs/core'
import { ChoiceGroup, Stack, TextField, TextFieldBase } from '@fluentui/react'
import toast from 'cogo-toast'
import React from 'react'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { setTabKeyBuySell } from '@/actions/setTabKeyBuySell'

export const SidebarSettingsDialog: React.FC = () => {
  const macroAmountInputRef = React.createRef<TextFieldBase>()
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector(
    state => state.settings.betterEtoroUISettingsDialog,
  )
  const [executionAmount, executionAmountSet] = React.useState(
    settings.betterEtoroUIConfig.executionAmount,
  )

  return (
    <Dialog
      title={i18n.腳本標題()}
      canEscapeKeyClose={true}
      canOutsideClickClose={false}
      onClose={() => {
        dispatch(toggleSettingsDialog(false))
      }}
      isOpen={dialogOpen}
    >
      <Stack tokens={{ padding: 16, childrenGap: 32 }}>
        <Stack.Item>
          <TextField
            componentRef={macroAmountInputRef}
            label={i18n.下單巨集金額設定()}
            defaultValue={settings.betterEtoroUIConfig.executionAmount.join(
              ',',
            )}
            value={executionAmount.join(',')}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'enter') {
                const value = (macroAmountInputRef.current?.value || '200')
                  .split(',')
                  .map(Number)
                dispatch(setMacroAmount(value))
                executionAmountSet(value)
              }
            }}
            onBlur={event => {
              dispatch(setMacroAmount(executionAmount))
            }}
          ></TextField>
        </Stack.Item>

        <Stack.Item>
          <ChoiceGroup
            label={i18n.使下單視窗能夠單鍵快速切換買賣()}
            defaultSelectedKey={
              settings.betterEtoroUIConfig.useTabKeyBuySell ? 'ON' : 'OFF'
            }
            options={[
              {
                key: 'ON',
                text: 'ON',
                iconProps: { iconName: 'KeyboardClassic' },
              },
              {
                key: 'OFF',
                text: 'OFF',
                iconProps: { iconName: 'Cancel' },
              },
            ]}
            onChange={async (event, option) => {
              await dispatch(
                setTabKeyBuySell(option?.key === 'ON' ? true : false),
              )
            }}
          ></ChoiceGroup>
        </Stack.Item>

        <Stack.Item>
          <ChoiceGroup
            label={i18n.下單巨集啟用狀態()}
            defaultSelectedKey={settings.isMacroEnabled ? 'ON' : 'OFF'}
            options={[
              {
                key: 'ON',
                text: 'ON',
                iconProps: { iconName: 'ActivateOrders' },
              },
              {
                key: 'OFF',
                text: 'OFF',
                iconProps: { iconName: 'DeactivateOrders' },
              },
            ]}
            onChange={(event, option) => {
              const yourEnabled = option?.key === 'ON' ? true : false

              dispatch(setMacroEnabled(yourEnabled))

              storage.saveConfig({ executionMacroEnabled: yourEnabled })

              emitter.emit(Events.settingChange)

              toast.success(
                i18n.設定已變更(() => (
                  <span>{JSON.stringify(yourEnabled)}</span>
                )),
                { position: 'bottom-left' },
              )
            }}
          ></ChoiceGroup>
        </Stack.Item>

        <Stack.Item>
          <ChoiceGroup
            label={i18n.設定幣別(settings.exchange.selected)}
            defaultSelectedKey={settings.exchange.selected}
            options={[
              {
                key: 'NTD',
                text: 'NTD',
                iconProps: { iconName: 'AllCurrency' },
              },
              {
                key: 'MYR',
                text: 'MYR',
                iconProps: { iconName: 'AllCurrency' },
              },
            ]}
            onChange={async (event, option) => {
              const loading = toast.loading(i18n.設定變更中(), {
                position: 'bottom-left',
              })

              const youSelected = (option?.key ||
                'NTD') as typeof exchange['selected']

              if (youSelected === 'NTD') {
                exchange.NTD = await getNTD()
              }

              if (youSelected === 'MYR') {
                exchange.MYR = await getMYR()
              }

              dispatch(setExchangeSelected(youSelected))

              storage.saveConfig({ selectedExchange: youSelected })

              emitter.emit(Events.settingChange)

              toast.success(
                i18n.設定已變更(() => <span>{youSelected}</span>),
                { position: 'bottom-left' },
              )

              loading.hide?.()
            }}
          />
        </Stack.Item>
      </Stack>
    </Dialog>
  )
}
