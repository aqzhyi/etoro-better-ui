import { useRef, useState } from 'react'
import { angularAPI } from '~/angularAPI'
import { useAppSelector } from '~/store/_store'

export const usePosition = (positionId: InstrumentPosition['PositionID']) => {
  const closed = useAppSelector(
    state => !state.positions.ids.includes(positionId),
  )
  const [closing, setClosing] = useState<boolean | null>(null)
  const prevValue = useRef<InstrumentPosition | null>(null)
  const [value, setValue] = useState<InstrumentPosition | null>(null)

  const close = () => {
    setClosing(true)
    value?.close()
  }

  const update = () => {
    if (closed === true) return

    const position = angularAPI.getPositionById(positionId)
    const instrument = position
      ? angularAPI.getInstrumentById(position.InstrumentID)
      : null

    if (position && instrument) {
      prevValue.current = position
    }

    setValue(position)
  }

  return {
    /** The value update after the update function call, if position has closed, expected the value is previously value */
    value: value || prevValue.current,
    /** When user click, trigger this immediately to ture, useful if UI want to response to user */
    closing,
    /** When the position is closed, trigger this immediately, useful if UI want to keep the copy to user */
    closed,
    /** When user click, send the signal for close position */
    close,
    /** Update position properties */
    update,
  }
}
