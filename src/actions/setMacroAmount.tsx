import React from 'react'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store/_store'
import toast from 'cogo-toast'
import { emitter, Events } from '@/emitter'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { gaAPI, GaEventId } from '@/gaAPI'
import i18next from 'i18next'
import { PrimaryTrans } from '@/components/PrimaryTrans'

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
      i18next.t('dialog_buttonsSetup_help'),
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
      <PrimaryTrans
        i18nKey='universal_doChanged_text'
        values={{
          text: thunkValue.join(','),
        }}
      ></PrimaryTrans>,
      { position: 'bottom-left' },
    )
  } else {
    toast.info(
      <PrimaryTrans
        i18nKey='universal_doNothing_text'
        values={{
          text: state.settings.executionAmount.join(','),
        }}
      ></PrimaryTrans>,
      { position: 'bottom-left' },
    )
  }

  return thunkAPI.rejectWithValue('📣 使用者取消 prompt 操作')
})
