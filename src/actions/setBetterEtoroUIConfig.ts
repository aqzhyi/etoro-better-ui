import { BetterEtoroUIConfig, storage } from '@/storage'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const setBetterEtoroUIConfig = createAsyncThunk<
  BetterEtoroUIConfig,
  Partial<BetterEtoroUIConfig>
>('setBetterEtoroUIConfig', async function (props, thunkAPI) {
  storage.saveConfig(props)
  const configs = storage.findConfig()
  return configs
})
