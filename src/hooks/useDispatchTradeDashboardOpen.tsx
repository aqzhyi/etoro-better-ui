import React from 'react'
import { toggleTradeDashboard } from '~/actions/toggleTradeDashboard'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const useDispatchTradeDashboardOpen = () => {
  const dispatch = useAppDispatch()
  const showState = useAppSelector(state => state.display.tradeDashboard)

  const toggle = () => {
    if (showState) {
      close()
    } else {
      open()
    }
  }

  const open = () => {
    gaAPI.sendEvent(GaEventId.sidebar_dashboardLinkClick)
    dispatch(toggleTradeDashboard(true))
  }

  const close = () => {
    gaAPI.sendEvent(GaEventId.sidebar_dashboardLinkClick)
    dispatch(toggleTradeDashboard(false))
  }

  return {
    toggle,
    open,
    close,
  }
}
