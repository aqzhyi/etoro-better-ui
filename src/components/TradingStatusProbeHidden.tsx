import React, { Fragment } from 'react'
import { useInterval, useMount } from 'react-use'
import { fetchStatusInfoAggregate } from '~/actions/fetchStatusInfoAggregate'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const TradingStatusProbeHidden: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const pingRate = useAppSelector(
    state => state.settings.intervalCheckingStatus,
  )

  useMount(() => {
    if (pingRate > 0) {
      dispatch(fetchStatusInfoAggregate())
    }
  })

  useInterval(() => {
    dispatch(fetchStatusInfoAggregate())
  }, pingRate * 1000 || null)

  return <Fragment></Fragment>
}
