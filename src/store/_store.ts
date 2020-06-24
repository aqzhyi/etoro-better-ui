import {
  configureStore,
  createAction,
  createReducer,
  combineReducers,
  createAsyncThunk,
  applyMiddleware,
  AnyAction,
} from '@reduxjs/toolkit'
import { produce } from 'immer'
import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroEnabled } from '@/actions/setMacroEnabled'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setMacroLever } from '@/actions/setMacroLever'
import { storage, BetterEtoroUIConfig } from '@/storage'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import { setListCompact } from '@/actions/setListCompact'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { fetchExtraCurrency } from '@/actions/fetchExtraCurrency'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { setTabKeyBuySell } from '@/actions/setTabKeyBuySell'
import { createLogger } from 'redux-logger'
import {
  StatusInfoAggregate,
  fetchStatusInfoAggregate,
} from '@/actions/fetchStatusInfoAggregate'
import { fetchPingValue } from '@/actions/setPingValue'

const settings = createReducer<{
  pingValue: number
  statusInfoAggregate: Partial<StatusInfoAggregate>
  betterEtoroUISettingsDialog: boolean
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
    pingValue: 0,
    statusInfoAggregate: {},
    betterEtoroUISettingsDialog: false,
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
      .addCase(fetchPingValue.fulfilled, (state, action) =>
        produce(state, () => {
          state.pingValue = action.payload
          return state
        }),
      )
      .addCase(fetchStatusInfoAggregate.fulfilled, (state, action) =>
        produce(state, () => {
          state.statusInfoAggregate = action.payload
          return state
        }),
      )
      .addCase(fetchStatusInfoAggregate.pending, (state, action) =>
        produce(state, () => {
          state.statusInfoAggregate = {}
          return state
        }),
      )
      .addCase(setTabKeyBuySell.fulfilled, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig.useTabKeyBuySell = action.payload
          return state
        }),
      )
      .addCase(toggleSettingsDialog, (state, action) =>
        produce(state, () => {
          state.betterEtoroUISettingsDialog = action.payload
          return state
        }),
      )
      .addCase(fetchExtraCurrency.fulfilled, (state, action) =>
        produce(state, () => {
          state.exchange.MYR = action.payload.MYR
          state.exchange.NTD = action.payload.NTD
          return state
        }),
      )
      .addCase(setBetterEtoroUIConfig.fulfilled, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig = action.payload
          return state
        }),
      )
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
  enhancers: [
    applyMiddleware(
      createLogger({
        collapsed: true,
        timestamp: false,
        diff: true,
        predicate: (getState, action: AnyAction) => {
          if (action.type === fetchStatusInfoAggregate.pending.type)
            return false
          if (action.type === fetchStatusInfoAggregate.fulfilled.type)
            return false
          if (action.type === fetchPingValue.pending.type) return false
          if (action.type === fetchPingValue.fulfilled.type) return false

          return true
        },
      }),
    ),
  ],
})

export type RootState = ReturnType<typeof rootReducers>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
