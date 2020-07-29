import React from 'react'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store/_store'
import toast from 'cogo-toast'
import { i18n } from '@/i18n'
import { emitter, Events } from '@/emitter'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { gaAPI, GaEventId } from '@/gaAPI'

export const openPromptForSetMacroAmount = createAsyncThunk<
  void,
  number[] | undefined,
  {
    rejectValue: string
  }
>('setMacroAmount', async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState

  const newValue = (props?.join(',') ||
    prompt(
      i18n.下單巨集金額設定(),
      state.settings.executionAmount.join(','),
    )) as string

  if (newValue) {
    const thunkValue = newValue.split(',').map(Number)

    gaAPI.sendEvent(
      GaEventId.setting_amountButtonsSet,
      `values=${thunkValue.join(',')}`,
    )

    thunkAPI.dispatch(
      setBetterEtoroUIConfig({
        executionAmount: thunkValue,
      }),
    )

    toast.success(
      i18n.設定已變更(() => <span>{thunkValue.join(',')}</span>),
      { position: 'bottom-left' },
    )
  }

  toast.info(
    i18n.設定未變更(() => (
      <span>{state.settings.executionAmount.join(',')}</span>
    )),
    { position: 'bottom-left' },
  )

  return thunkAPI.rejectWithValue('📣 使用者取消 prompt 操作')
})
