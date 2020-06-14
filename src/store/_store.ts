import {
  configureStore,
  createAction,
  createReducer,
  combineReducers,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { produce } from 'immer'
import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroEnabled } from '@/actions/setMacroEnabled'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setMacroLever } from '@/actions/setMacroLever'
import { storage, BetterEtoroUIConfig } from '@/storage'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { setListCompact } from '@/actions/setListCompact'

const settings = createReducer<{
  betterEtoroUIConfig: BetterEtoroUIConfig
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
    betterEtoroUIConfig: storage.findConfig(),
    isMacroEnabled: storage.findConfig().executionMacroEnabled,
    exchange: {
      selected: storage.findConfig().selectedExchange,
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
      )
      .addCase(setMacroAmount.fulfilled, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig.executionAmount = [...action.payload]
          return state
        }),
      )
      .addCase(setMacroLever, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig.executionLever = [...action.payload]
          return state
        }),
      )
      .addCase(setListCompact, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig.listCompactOn = action.payload
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
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
