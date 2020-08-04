import { useAppDispatch, useAppSelector } from '@/store/_store'
import { Label, Stack, Toggle } from '@fluentui/react'
import React from 'react'
import { i18n } from '@/i18n'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

export const UniversalHotkeySettings: React.FC = props => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(state => state.settings.useHotkeys)

  return (
    <React.Fragment>
      <Label>{i18n.universal_useKeyboardHotkeys_brief()}</Label>

      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <Stack.Item>
          <Toggle
            label={'Tab'}
            checked={settings?.dialogBuySellSwitch ? true : false}
            onChange={(event, enabled) => {
              dispatch(
                setBetterEtoroUIConfig({
                  useHotkeys: {
                    ...settings,
                    dialogBuySellSwitch: enabled ? 'Tab' : null,
                  },
                }),
              )
            }}
          ></Toggle>
        </Stack.Item>

        <Stack.Item>
          <Toggle
            label={'ESC'}
            checked={settings?.dialogClose ? true : false}
            onChange={(event, enabled) => {
              dispatch(
                setBetterEtoroUIConfig({
                  useHotkeys: {
                    ...settings,
                    dialogClose: enabled ? 'Esc' : null,
                  },
                }),
              )
            }}
          ></Toggle>
        </Stack.Item>

        <Stack.Item>
          <Toggle
            label={'Space'}
            checked={settings?.dialogOpenTrade ? true : false}
            onChange={(event, enabled) => {
              dispatch(
                setBetterEtoroUIConfig({
                  useHotkeys: {
                    ...settings,
                    dialogOpenTrade: enabled ? ' ' : null,
                  },
                }),
              )
            }}
          ></Toggle>
        </Stack.Item>

        <Stack.Item>
          <Toggle
            label={'F'}
            checked={settings?.watchlistFilter ? true : false}
            onChange={(event, enabled) => {
              dispatch(
                setBetterEtoroUIConfig({
                  useHotkeys: {
                    ...settings,
                    watchlistFilter: enabled ? 'F' : null,
                  },
                }),
              )
            }}
          ></Toggle>
        </Stack.Item>
      </Stack>
    </React.Fragment>
  )
}
