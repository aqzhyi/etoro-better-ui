import * as React from 'react'
import { memo } from 'react'

export const ChangePoints = memo<
  React.PropsWithChildren<{
    value: number
    className?: string
  }>
>(function ChangePoints(props) {
  const value = (1 + props.value * 1000000 - 1) / 10

  return <span className={props.className}>{value}</span>
})
