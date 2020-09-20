import React, { memo } from 'react'
import { ProfitText } from '~/components/ProfitText'

/**
 * The count diff of between on open-rate and current-rate for user position
 */
export const InstrumentRateChangeCount: React.FC<{
  isBuy: boolean
  current: number
  openRate: number
}> = memo(function InstrumentRateChangeCount(props) {
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
