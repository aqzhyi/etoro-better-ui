import React from 'react'
import { useInterval } from 'react-use'
import { debugAPI } from '@/debugAPI'
import { fetchStatusInfoAggregate } from '@/actions/fetchStatusInfoAggregate'
import { fetchPingValue } from '@/actions/setPingValue'
import { useAppDispatch } from '@/store/_store'

export const UniversalEtoroStatusObserver = () => {
  const dispatch = useAppDispatch()

  useInterval(() => {
    debugAPI.universal('檢查 status.etoro.com 功能狀況')
    dispatch(fetchStatusInfoAggregate())
  }, 5000)

  useInterval(() => {
    debugAPI.universal('推斷大致延遲時間')
    dispatch(fetchPingValue())
  }, 5000)

  return <span id={UniversalEtoroStatusObserver.name}></span>
}
