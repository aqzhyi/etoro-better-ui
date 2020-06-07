import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store/_store'
import { storage } from '@/storage'
import toast from 'cogo-toast'

export const setMacroAmount = createAsyncThunk<
  number[],
  void,
  {
    rejectValue: string
  }
>('setMacroAmount', async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState

  const newValue = prompt(
    `請輸入「數字」，以「,」分隔。例如 200,500,1000,2000,3000`,
    state.settings.betterEtoroUIConfig.executionAmount.join(','),
  )

  if (newValue) {
    const thunkValue = newValue.split(',').map(Number)

    storage.saveConfig({ executionAmount: thunkValue })

    toast.success(`設定已變更，當前：${newValue}`, {
      position: 'bottom-left',
    })

    return thunkValue
  }

  toast.info(
    `設定未變更，當前：${state.settings.betterEtoroUIConfig.executionAmount.join(
      ',',
    )}`,
    {
      position: 'bottom-left',
    },
  )

  return thunkAPI.rejectWithValue('📣 使用者取消 prompt 操作')
})
