import { BetterEtoroUIConfig } from '@/storage'
import { createAction } from '@reduxjs/toolkit'

export const setBetterEtoroUIConfig = createAction<
  Partial<BetterEtoroUIConfig>
>('setBetterEtoroUIConfig')
