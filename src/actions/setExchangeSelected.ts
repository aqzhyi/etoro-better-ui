import { createAction } from '@reduxjs/toolkit'

export const setExchangeSelected = createAction<'NTD' | 'MYR'>(
  'setExchangeSelected',
)
