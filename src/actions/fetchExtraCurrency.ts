import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { getMYR, getNTD } from '~/exchange'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { emitter, Events } from '~/emitter'

export const fetchExtraCurrency = createAsyncThunk(
  'fetchExtraCurrency',
  async function fetchExtraCurrencyThunk(props, thunkAPI) {
    const exchange = await Promise.all([getNTD(), getMYR()]).then(gets => {
      const ntd = gets[0]
      const myr = gets[1]

      const exchange = {
        NTD: ntd,
        MYR: myr,
      }

      thunkAPI.dispatch(setBetterEtoroUIConfig({ MYR: myr, NTD: ntd }))

      return exchange
    })

    thunkAPI.dispatch(
      setBetterEtoroUIConfig({
        ...exchange,
      }),
    )
  },
)
