import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPingValue = createAsyncThunk<number>(
  'setPingValue',
  async function (props) {
    const start = new Date().getTime()

    const pingValue = await globalThis
      .fetch('https://api.etorostatic.com/sapi/candles/closingprices.json')
      .then(() => {
        const end = new Date().getTime()
        return end - start
      })
      .catch(() => {
        return 0
      })

    return pingValue
  },
)
