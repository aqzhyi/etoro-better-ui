import Big from 'big.js'
import * as React from 'react'
import { memo } from 'react'

export const ChangePoints = memo<
  React.PropsWithChildren<{
    value: number
    className?: string
  }>
>(function ChangePoints(props) {
  const value = Big(1).plus(Big(props.value).times(1000000)).minus(1).div(10)

  return <span className={props.className}>{value.toNumber()}</span>
})
