import Big from 'big.js'
import * as React from 'react'
import { memo } from 'react'

export const ChangePoints = memo<
  React.PropsWithChildren<{
    value: number
    className?: string
  }>
>(function ChangePoints(props) {
  if (props.value === 0) {
    return <span></span>
  }

  const valueAsString = props.value.toString().split('.')
  const precision = valueAsString?.[1]?.length ?? 0
  const integerValue = Number(valueAsString[0])
  const withPrecision = Big(10).pow(precision - 1)

  const value =
    integerValue >= 1
      ? Big(Number(valueAsString[0]))
      : Big(Number(`${valueAsString[0]}${valueAsString[1]}`))

  const changePoints =
    integerValue >= 1
      ? value
      : Big(1).plus(value.times(withPrecision)).minus(1).div(withPrecision)

  return <span className={props.className}>{changePoints.toNumber()}</span>
})
