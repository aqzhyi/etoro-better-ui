import React, { Fragment } from 'react'
import { useInterval, useMount } from 'react-use'
import { fetchPingValue } from '~/actions/setPingValue'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const PingProbeHidden: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const pingRate = useAppSelector(
    state => state.settings.intervalCheckingStatus,
  )

  useMount(() => {
    if (pingRate > 0) {
      dispatch(fetchPingValue())
    }
  })

  useInterval(() => {
    dispatch(fetchPingValue())
  }, pingRate * 1000 || null)

  return <Fragment></Fragment>
}
