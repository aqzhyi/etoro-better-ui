import { angularAPI } from '~/angularAPI'
import { useMemo, useState } from 'react'

export const useRate = () => {
  const model = useMemo(() => {
    return angularAPI.executionDialogScope?.model
  }, [])

  const [value, valueSetter] = useState(model?.instrument?.rate || null)

  const update = () => {
    valueSetter(prev =>
      model?.instrument?.rate
        ? {
            ...prev,
            ...model.instrument?.rate,
            // trigger values within getters
            lastPrice: model.instrument?.rate.lastPrice,
            lastAskPrice: model.instrument?.rate.lastAskPrice,
            lastAskChange: model.instrument?.rate.lastAskChange,
            lastBidChange: model.instrument?.rate.lastBidChange,
          }
        : null,
    )
  }

  return {
    value,
    updateValue: update,
    model,
  }
}
