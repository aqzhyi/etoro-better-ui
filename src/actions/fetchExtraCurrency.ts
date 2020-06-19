import { createAsyncThunk } from '@reduxjs/toolkit'
import { getNTD, getMYR } from '@/exchange'
import { emitter, Events } from '@/emitter'
import { storage } from '@/storage'
import store from '@/store/_store'

export const fetchExtraCurrency = createAsyncThunk<{
  MYR: {
    buy: number
    sell: number
  }
  NTD: {
    buy: number
    sell: number
  }
}>('fetchExtraCurrency', async function fetchExtraCurrencyThunk(
  props,
  thunkAPI,
) {
  return await Promise.all([getNTD(), getMYR()]).then(gets => {
    const ntd = gets[0]
    const myr = gets[1]

    const exchange = {
      NTD: ntd,
      MYR: myr,
    }

    return exchange
  })
})
