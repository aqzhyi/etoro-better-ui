import { cloneDeep } from 'lodash'
import { useMemo, useState } from 'react'
import { angularAPI, Position } from '~/angularAPI'

export const useInstrumentPosition = (positionId?: Position['PositionID']) => {
  const [closing, setClosing] = useState(false)

  const getPostionById = (positionId?: Position['PositionID']) => {
    // clone deep to avoid crash from angular two way data binding cause inside react application
    const _position = cloneDeep(angularAPI.$rootScope?.session.user.portfolio.getPositionById(positionId)) as Position

    // get value from getter function
    const _positionCopy = {
      Amount: _position.Amount,
      Leverage: _position.Leverage,
      CurrentRate: _position.CurrentRate,
      Equity: _position.Equity,
      InitialAmountInDollars: _position.InitialAmountInDollars,
      InitialUnits: _position.InitialUnits,
      Instrument: _position.Instrument,
      IsBuy: _position.IsBuy,
      LastRateChange: _position.LastRateChange,
      OpenDateTime: _position.OpenDateTime,
      OpenRate: _position.OpenRate,
      PositionID: _position.PositionID,
      Profit: _position.Profit,
      TakeProfitRate: _position.TakeProfitRate,
      isPendingClose: _position.isPendingClose
    } as Position

    // if you can't close the position, revert closing prop when update
    setClosing(false)

    return {
      ..._positionCopy,
      close: () => {
        setClosing(true)
        globalThis.setTimeout(() => {
          _position?.close()
        })
      },
    }
  }

  const _position = useMemo(() => getPostionById(positionId), [angularAPI.$rootScope?.session.user.portfolio.positions])

  const [position, setPosition] = useState(_position)

  const update = () => {
    setPosition(getPostionById(_position.PositionID))
  }

  return { position, closing, update }
}
