import { fetchExtraCurrency } from '@/actions/fetchExtraCurrency'
import {
  fetchStatusInfoAggregate,
  StatusInfoAggregate,
} from '@/actions/fetchStatusInfoAggregate'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { setListCompact } from '@/actions/setListCompact'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setMacroLever } from '@/actions/setMacroLever'
import { fetchPingValue } from '@/actions/setPingValue'
import { setTabKeyBuySell } from '@/actions/setTabKeyBuySell'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { BetterEtoroUIConfig, storage } from '@/storage'
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  configureStore,
  createReducer,
} from '@reduxjs/toolkit'
import { produce } from 'immer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { createLogger } from 'redux-logger'

const settings = createReducer<{
  pingValue: number
  statusInfoAggregate: Partial<StatusInfoAggregate>
  betterEtoroUISettingsDialog: boolean
  betterEtoroUIConfig: BetterEtoroUIConfig
  isMacroEnabled: boolean
}>(
  {
    pingValue: 0,
    statusInfoAggregate: {},
    betterEtoroUISettingsDialog: false,
    betterEtoroUIConfig: storage.findConfig(),
    isMacroEnabled: storage.findConfig().executionMacroEnabled,
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
          state.betterEtoroUIConfig.MYR = action.payload.MYR
          state.betterEtoroUIConfig.NTD = action.payload.NTD
          return state
        }),
      )
      .addCase(setBetterEtoroUIConfig.fulfilled, (state, action) =>
        produce(state, () => {
          state.betterEtoroUIConfig = action.payload
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
