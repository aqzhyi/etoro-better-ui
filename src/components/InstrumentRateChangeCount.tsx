import React from 'react'
import { InstrumentPosition } from '~/angularAPI'
import { ProfitText } from '~/components/ProfitText'

/** 開倉位距離當前點位點數合計 */
export const InstrumentRateChangeCount: React.FC<{
  position?: InstrumentPosition
}> = props => {
  if (!props.position) {
    return null
  }

  return (
    <ProfitText
      profit={
        (props.position.IsBuy &&
          props.position.CurrentRate - props.position.OpenRate) ||
        props.position.OpenRate - props.position.CurrentRate
      }
      noDollarSign
    ></ProfitText>
  )
}
