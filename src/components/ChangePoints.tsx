import * as React from 'react'
import { memo } from 'react'
import { getChangePoints } from '~/utils/getChangePoints'

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

  return (
    <span className={props.className}>
      {getChangePoints(props.value, props.precision)}
    </span>
  )
})
