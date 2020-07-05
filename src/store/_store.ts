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
      .addCase(fetchPingValue.fulfilled, (state, action) => {
        state.pingValue = action.payload
      })
      .addCase(fetchStatusInfoAggregate.fulfilled, (state, action) => {
        state.statusInfoAggregate = action.payload
      })
      .addCase(fetchStatusInfoAggregate.pending, (state, action) => {
        state.statusInfoAggregate = {}
      })
      .addCase(setTabKeyBuySell.fulfilled, (state, action) => {
        state.betterEtoroUIConfig.useTabKeyBuySell = action.payload
      })
      .addCase(toggleSettingsDialog, (state, action) => {
        state.betterEtoroUISettingsDialog = action.payload
      })
      .addCase(fetchExtraCurrency.fulfilled, (state, action) => {
        state.betterEtoroUIConfig.MYR = action.payload.MYR
        state.betterEtoroUIConfig.NTD = action.payload.NTD
      })
      .addCase(setBetterEtoroUIConfig.fulfilled, (state, action) => {
        state.betterEtoroUIConfig = action.payload
      })
      .addCase(setMacroAmount.fulfilled, (state, action) => {
        state.betterEtoroUIConfig.executionAmount = [...action.payload]
      })
      .addCase(setMacroLever, (state, action) => {
        state.betterEtoroUIConfig.executionLever = [...action.payload]
      })
      .addCase(setListCompact, (state, action) => {
        state.betterEtoroUIConfig.listCompactOn = action.payload
      }),
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
