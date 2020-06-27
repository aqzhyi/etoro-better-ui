import { createAsyncThunk } from '@reduxjs/toolkit'
import { BetterEtoroUIConfig, storage, DEFAULT_CONFIG } from '@/storage'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

export const resetBetterEtoroUIConfig = createAsyncThunk(
  'resetBetterEtoroUIConfig',
  async (props, thunkAPI) => {
    thunkAPI.dispatch(setBetterEtoroUIConfig(DEFAULT_CONFIG))
  },
)
