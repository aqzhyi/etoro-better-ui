import { Nilable } from 'tsdef'
import { angularAPI, InstrumentRate } from '@/angularAPI'
import { useMemo, useState, useCallback } from 'react'

export const useExecutionDialogScope = () => {
  const scope = useMemo(() => {
    return angularAPI.executionDialogScope
  }, [])

  const [rateValue, rateSetter] = useState<Nilable<InstrumentRate>>(
    scope?.model.instrument?.rate || null,
  )

  const updateRate = useCallback(() => {
    rateSetter(prev =>
      scope?.model.instrument?.rate
        ? { ...prev, ...scope?.model.instrument?.rate }
        : null,
    )
  }, [scope])

  return {
    rate: {
      value: rateValue,
      update: updateRate,
    },
    scope,
  }
}
