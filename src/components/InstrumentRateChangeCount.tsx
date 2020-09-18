import React, { memo } from 'react'
import { ProfitText } from '~/components/ProfitText'

/** 開倉位距離當前點位點數合計 */
export const InstrumentRateChangeCount: React.FC<{
  isBuy: boolean
  current: number
  openRate: number
}> = memo(props => {
  return (
    <ProfitText
      profit={
        (props.isBuy && props.current - props.openRate) ||
        props.openRate - props.current
      }
      noDollarSign
    ></ProfitText>
  )
})
