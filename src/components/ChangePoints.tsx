import Big from 'big.js'
import * as React from 'react'
import { memo } from 'react'

export const ChangePoints = memo<
  React.PropsWithChildren<{
    value: number
    className?: string
    precision?: number
  }>
>(function ChangePoints(props) {
  if (props.value === 0) {
    return <span></span>
  }

  const valueAsString = props.value.toString().split('.')
  const precision = props.precision ?? valueAsString?.[1]?.length ?? 0

  const value = Big(
    Number(
      `${valueAsString[0]}${valueAsString[1]?.padEnd(precision, '0') || ''}`,
    ),
  )

  return <span className={props.className}>{value.toNumber()}</span>
})
