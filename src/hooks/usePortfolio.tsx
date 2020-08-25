import { angularAPI } from '~/angularAPI'
import { useState } from 'react'

export const usePortfolio = () => {
  const scope = angularAPI.$rootScope

  const [portfolio, portfolioSetter] = useState(
    scope?.session.user.portfolio || null,
  )

  const update = () => {
    portfolioSetter(prev =>
      scope?.session.user.portfolio
        ? {
            ...scope?.session.user.portfolio,
          }
        : null,
    )
  }

  const closePosition = (positionId: string) => {
    portfolio?.positions[positionId]?.close()
  }

  return {
    update,
    value: portfolio,
    closePosition,
  }
}
