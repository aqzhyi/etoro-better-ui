import { useGetSet, useInterval } from 'react-use'
import { angularAPI } from '~/angularAPI'
import { useAppSelector } from '~/store/_store'

export const useDialogPostions = () => {
  const dialogOpen = useAppSelector(
    state => state.display.nativeTradeDialogOpen,
  )
  const [positions, setPositions] = useGetSet<InstrumentPosition[]>([])

  const update = () => {
    setPositions(
      angularAPI.getPositionByInstrumentId(
        angularAPI.executionDialogScope?.controller?.instrument?.InstrumentID ??
          0,
      ),
    )
  }

  const useIntervalUpdate = (ms = 500) => {
    return useInterval(
      () => {
        update()
      },
      dialogOpen && positions.length <= 0 ? ms : null,
    )
  }

  return {
    state: positions,
    acts: {
      update,
      useIntervalUpdate,
    },
  }
}
