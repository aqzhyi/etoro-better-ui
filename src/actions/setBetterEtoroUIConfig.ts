import { BetterEtoroUIConfig, storage } from '@/storage'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { emitter, Events } from '@/emitter'

export const setBetterEtoroUIConfig = createAsyncThunk<
  BetterEtoroUIConfig,
  Partial<BetterEtoroUIConfig>
>('setBetterEtoroUIConfig', async function (props, thunkAPI) {
  storage.saveConfig(props)
  const configs = storage.findConfig()
  emitter.emit(Events.settingChange)
  return configs
})
