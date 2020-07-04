import React from 'react'
import { useAppSelector } from '@/store/_store'
import { toCurrency } from '@/toCurrency'

export const FooterUnitValue: React.FC<{
  USD: number
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

  const localValues = toCurrency(exchanges[selected].buy * props.USD)

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
