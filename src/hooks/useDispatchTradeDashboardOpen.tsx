import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { useAppDispatch } from '~/store/_store'

export const useDispatchTradeDashboardOpen = () => {
  const dispatch = useAppDispatch()

  const open = () => {
    dispatch(setBetterEtoroUIConfig({ showTradeDashboard: true }))
  }

  const close = () => {
    dispatch(setBetterEtoroUIConfig({ showTradeDashboard: false }))
  }

  return {
    open,
    close,
  }
}
