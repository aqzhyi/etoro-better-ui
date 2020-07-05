import React from 'react'
import { Toggle } from '@fluentui/react'
import { i18n } from '@/i18n'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { storage } from '@/storage'
import { setListCompact } from '@/actions/setListCompact'
import { angularAPI } from '@/angularAPI'

export const WatchlistCompactSwitch = () => {
  const dispatch = useAppDispatch()
  const listCompactOn = useAppSelector(
    state => state.settings.betterEtoroUIConfig.listCompactOn,
  )

  return (
    <Toggle
      className={WatchlistCompactSwitch.name}
      label={i18n.使緊湊()}
      inlineLabel
      checked={listCompactOn}
      onClick={() => {
        storage.saveConfig({ listCompactOn: !listCompactOn })
        angularAPI.toggleListCompact(!listCompactOn)
        dispatch(setListCompact(!listCompactOn))
      }}
    />
  )
}
