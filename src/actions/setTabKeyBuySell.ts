import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { storage } from '@/storage'

export const setTabKeyBuySell = createAsyncThunk<boolean, boolean>(
  'toggleTabKeyBuySell',
  (enable, thunkAPI) => {
    storage.saveConfig({ useTabKeyBuySell: enable })

    return enable
  },
)
