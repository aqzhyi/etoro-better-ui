import React from 'react'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { useAppSelector } from '~/store/_store'

export const PingProbeValue: React.FC<{
  /**
   * Pass children display as Tooltip component
   *
   * Missing children display Text component
   */
  children?: React.ReactNode
}> = props => {
  const pingValue = useAppSelector(state => state.status.pingValue)

  if (props.children) {
    return (
      <PrimaryTooltip
        title={
          <PrimaryTrans
            i18nKey='status_inferringDelay_text'
            values={{
              value: pingValue || '***',
            }}
          ></PrimaryTrans>
        }
      >
        {props.children}
      </PrimaryTooltip>
    )
  }

  return (
    <PrimaryTrans
      i18nKey='status_inferringDelay_text'
      values={{
        value: pingValue || '---',
      }}
    ></PrimaryTrans>
  )
}
