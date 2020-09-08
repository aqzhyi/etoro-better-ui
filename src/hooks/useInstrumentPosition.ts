import { cloneDeep } from 'lodash'
import { useMemo, useState } from 'react'
import { angularAPI, InstrumentPosition } from '~/angularAPI'

export const useInstrumentPosition = (
  positionId?: InstrumentPosition['PositionID'],
) => {
  const [closing, setClosing] = useState(false)
  const [closed, setClosed] = useState<boolean>(false)
  const [
    historyPosition,
    setHistoryPosition,
  ] = useState<InstrumentPosition | null>(null)

  const getPostionById = (positionId?: InstrumentPosition['PositionID']) => {
    // clone deep to avoid crash from angular two way data binding cause inside react application
    const _position = cloneDeep(
      angularAPI.$rootScope?.session.user.portfolio.getPositionById(positionId),
    )

    if (_position) {
      setHistoryPosition(_position)
    }

    if (!_position) {
      setClosed(true)
      return null
    }

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
      isPendingClose: _position.isPendingClose,
      TakeProfitAmount: _position.TakeProfitAmount,
      TakeProfitPercent: _position.TakeProfitPercent,
      StopLossAmount: _position.StopLossAmount,
      StopLossPercent: _position.StopLossPercent,
    } as InstrumentPosition

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

  const _position = useMemo(() => getPostionById(positionId), [
    angularAPI.$rootScope?.session.user.portfolio.positions,
  ])

  const [position, setPosition] = useState(_position)

  const update = () => {
    if (_position?.Instrument.IsActive) {
      setPosition(getPostionById(_position.PositionID))
    }
  }

  return {
    closed,
    position: position || historyPosition,
    closing,
    setClosing,
    update,
  }
}
