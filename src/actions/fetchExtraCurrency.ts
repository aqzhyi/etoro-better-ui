import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { getMYR, getNTD } from '@/exchange'
import { createAsyncThunk } from '@reduxjs/toolkit'

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

    thunkAPI.dispatch(setBetterEtoroUIConfig({ MYR: myr, NTD: ntd }))

    return exchange
  })
})
