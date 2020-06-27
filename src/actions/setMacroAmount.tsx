import React from 'react'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store/_store'
import { storage } from '@/storage'
import toast from 'cogo-toast'
import { i18n } from '@/i18n'
import { emitter, Events } from '@/emitter'

export const setMacroAmount = createAsyncThunk<
  number[],
  number[] | undefined,
  {
    rejectValue: string
  }
>('setMacroAmount', async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState

  const newValue = (props?.join(',') ||
    prompt(
      i18n.下單巨集金額設定(),
      state.settings.betterEtoroUIConfig.executionAmount.join(','),
    )) as string

  if (newValue) {
    const thunkValue = newValue.split(',').map(Number)

    storage.saveConfig({ executionAmount: thunkValue })

    toast.success(
      i18n.設定已變更(() => <span>{thunkValue.join(',')}</span>),
      { position: 'bottom-left' },
    )

    emitter.emit(Events.settingChange)

    return thunkValue
  }

  toast.info(
    i18n.設定未變更(() => (
      <span>
        {state.settings.betterEtoroUIConfig.executionAmount.join(',')}
      </span>
    )),
    { position: 'bottom-left' },
  )

  return thunkAPI.rejectWithValue('📣 使用者取消 prompt 操作')
})
