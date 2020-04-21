import {
  configureStore,
  createAction,
  createReducer,
  combineReducers,
} from '@reduxjs/toolkit'
import { produce } from 'immer'

const setExchangeSelected = createAction<'NTD' | 'MYR'>('setExchangeSelected')

const settingsReducer = createReducer<{
  isMacroEnabled: boolean
  exchange: {
    selected: 'NTD' | 'MYR'
    NTD: {
      buy: number
      sell: number
    }
    MYR: {
      buy: number
      sell: number
    }
  }
}>(
  {
    isMacroEnabled: false,
    exchange: {
      selected: 'NTD',
      NTD: {
        buy: 30,
        sell: 30,
      },
      MYR: {
        buy: 4.25,
        sell: 4.25,
      },
    },
  },
  builder =>
    builder.addCase(setExchangeSelected, (state, action) =>
      produce(state, () => {
        state.exchange.selected = action.payload
      }),
    ),
)

const store = configureStore({
  reducer: combineReducers({ settingsReducer }),
})

export default store
