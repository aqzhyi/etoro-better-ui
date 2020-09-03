import { useState } from 'react'
import { useInterval } from 'react-use'
import { angularAPI } from '~/angularAPI'

/**
 * Fetch available leverages from the angular scope in the Trade Dialog of Native eToro
 */
export const useDialogLeverAvailable = () => {
  const getScope = () => angularAPI.executionDialogScope

  const [levers, setLevers] = useState(getScope()?.model?.instrument?.Leverages)

  useInterval(
    () => {
      setLevers(getScope()?.model?.instrument?.Leverages)
    },
    getScope()?.model?.instrument?.Leverages.length ? null : 500,
  )

  return levers
}
