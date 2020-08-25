import { angularAPI } from '~/angularAPI'
import { useState } from 'react'
import { useInterval } from 'react-use'

export const useAppPendingOrder = () => {
  const [pendingOrders, pendingOrdersSetter] = useState([
    ...(angularAPI.$rootScope?.session.user.portfolio.orders || []),
  ])

  useInterval(() => {
    pendingOrdersSetter(() => [
      ...(angularAPI.$rootScope?.session.user.portfolio.orders || []),
    ])
  }, 5000)

  return { value: pendingOrders }
}
