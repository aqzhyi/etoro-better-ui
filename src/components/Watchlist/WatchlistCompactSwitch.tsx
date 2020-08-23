import React from 'react'
import { Toggle } from '@fluentui/react'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { angularAPI } from '@/angularAPI'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { gaAPI, GaEventId } from '@/gaAPI'
import { usePrimaryTranslation } from '@/hooks/usePrimaryTranslation'

export const WatchlistCompactSwitch = () => {
  const locale = usePrimaryTranslation()
  const dispatch = useAppDispatch()
  const listCompactOn = useAppSelector(state => state.settings.listCompactOn)

  return (
    <Toggle
      className={WatchlistCompactSwitch.name}
      label={locale.t('universal_compact_text')}
      inlineLabel
      checked={listCompactOn}
      onClick={() => {
        const enabled = !listCompactOn

        angularAPI.toggleListCompact(enabled)
        gaAPI.sendEvent(
          GaEventId.setting_compactEnabledSet,
          `onOff=${String(enabled)}`,
        )
        dispatch(
          setBetterEtoroUIConfig({
            listCompactOn: enabled,
          }),
        )
      }}
    />
  )
}
