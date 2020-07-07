import React, { useState } from 'react'
import { useAppSelector } from '@/store/_store'
import { toCurrency } from '@/toCurrency'
import { angularAPI } from '@/angularAPI'
import { useInterval, useMount } from 'react-use'

export const FooterUnitValue: React.FC<{
  type: keyof typeof angularAPI.$rootScope.session.user.portfolio
}> = props => {
  const selected = useAppSelector(
    state => state.settings.betterEtoroUIConfig.selectedExchange,
  )
  const exchanges = {
    NTD: useAppSelector(state => state.settings.betterEtoroUIConfig.NTD),
    MYR: useAppSelector(state => state.settings.betterEtoroUIConfig.MYR),
  }

  if (!selected || selected === 'HIDDEN') {
    return null
  }

  const [USD, USDSetter] = useState(0)

  useMount(() => {
    USDSetter(angularAPI.$rootScope.session.user.portfolio[props.type])
  })

  useInterval(() => {
    USDSetter(angularAPI.$rootScope.session.user.portfolio[props.type])
  }, 2500)

  const localValues = toCurrency(exchanges[selected].buy * USD)

  return (
    <React.Fragment>
      {selected === 'NTD' && (
        <React.Fragment>
          <span className='FooterUnitValue-Main'>{localValues[0]}</span>
          <span className='FooterUnitValue-Currency'>{selected}</span>
        </React.Fragment>
      )}
      {selected === 'MYR' && (
        <React.Fragment>
          <span className='FooterUnitValue-Main'>{localValues[0]}</span>.
          <span className='FooterUnitValue-Small'>{localValues[1]}</span>
          <span className='FooterUnitValue-Currency'>{selected}</span>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
