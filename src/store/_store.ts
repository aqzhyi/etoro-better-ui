import {
  configureStore,
  createAction,
  createReducer,
  combineReducers,
} from '@reduxjs/toolkit'
import { produce } from 'immer'
import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroEnabled } from '@/actions/setMacroEnabled'

const settings = createReducer<{
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
    builder
      .addCase(setExchangeSelected, (state, action) =>
        produce(state, () => {
          state.exchange.selected = action.payload
          return state
        }),
      )
      .addCase(setMacroEnabled, (state, action) =>
        produce(state, () => {
          state.isMacroEnabled = action.payload
          return state
        }),
      ),
)

const rootReducers = combineReducers({ settings })

const store = configureStore({
  reducer: rootReducers,
})

export type RootState = ReturnType<typeof rootReducers>
export type AppDispatch = typeof store.dispatch

export default store
