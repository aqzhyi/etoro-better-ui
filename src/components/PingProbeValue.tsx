import React from 'react'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
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
      <AppTooltip
        title={
          <AppTrans
            i18nKey='status_inferringDelay_text'
            values={{
              value: pingValue || '***',
            }}
          ></AppTrans>
        }
      >
        {props.children}
      </AppTooltip>
    )
  }

  return (
    <AppTrans
      i18nKey='status_inferringDelay_text'
      values={{
        value: pingValue || '---',
      }}
    ></AppTrans>
  )
}
