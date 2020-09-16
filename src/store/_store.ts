import {
  applyMiddleware,
  combineReducers,
  configureStore,
  createReducer,
} from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  fetchStatusInfoAggregate,
  StatusInfoAggregate,
} from '~/actions/fetchStatusInfoAggregate'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { setGroupPositionIds } from '~/actions/setGroupPositionIds'
import { fetchPingValue } from '~/actions/setPingValue'
import { syncNativeTradeDialogOpen } from '~/actions/syncFromNativeTradeDialogOpenState'
import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { toggleTradeDashboard } from '~/actions/toggleTradeDashboard'
import { angularAPI } from '~/angularAPI'
import { betterEtoroUIConfigsMiddleware } from '~/middlewares/betterEtoroUIConfigsMiddleware'
import { BetterEtoroUIConfig, storage } from '~/storage'
import { registeredComponents } from '~/utils/registerReactComponent'

const status = createReducer<{
  pingValue: number
  statusCheckAggregate: Partial<StatusInfoAggregate>
}>(
  {
    pingValue: 0,
    statusCheckAggregate: {},
  },
  builder =>
    builder
      .addCase(fetchPingValue.pending, (state, action) => {
        state.pingValue = 0
      })
      .addCase(fetchPingValue.fulfilled, (state, action) => {
        state.pingValue = action.payload
      })
      .addCase(fetchStatusInfoAggregate.pending, (state, aciton) => {
        state.statusCheckAggregate = {}
      })
      .addCase(fetchStatusInfoAggregate.fulfilled, (state, action) => {
        state.statusCheckAggregate = action.payload
      }),
)

const display = createReducer<{
  setupDialog: boolean
  tradeDashboard: boolean
  nativeTradeDialogOpen: boolean
}>(
  {
    setupDialog: false,
    tradeDashboard: false,
    nativeTradeDialogOpen: false,
  },
  builder =>
    builder
      .addCase(syncNativeTradeDialogOpen, (state, action) => {
        state.nativeTradeDialogOpen = action.payload
      })
      .addCase(toggleTradeDashboard, (state, action) => {
        state.tradeDashboard = action.payload
      })
      .addCase(toggleSetupDialog, (state, action) => {
        state.setupDialog = action.payload
      }),
)

const settings = createReducer<BetterEtoroUIConfig>(
  { ...storage.findConfig() },
  builder =>
    builder.addCase(setBetterEtoroUIConfig, (state, action) => {
      return { ...state, ...action.payload }
    }),
)

const positions = createReducer<{
  historyIds: number[]
  ids: number[]
}>(
  {
    historyIds: [],
    ids: [],
  },
  builder =>
    builder.addCase(setGroupPositionIds, (state, action) => {
      state.historyIds = uniq([
        ...state.historyIds,
        ...state.ids,
        ...action.payload,
      ]).sort((a, b) => b - a)
      state.ids = action.payload.sort((a, b) => b - a)
    }),
)

const rootReducers = combineReducers({
  display,
  settings,
  status,
  positions,
})

export const store = configureStore({
  reducer: rootReducers,
  enhancers: [
    applyMiddleware(
      betterEtoroUIConfigsMiddleware,
      // createLogger({
      //   collapsed: true,
      //   timestamp: false,
      //   diff: true,
      //   predicate: (getState, action: AnyAction) => {
      //     if (action.type === fetchStatusInfoAggregate.pending.type)
      //       return false
      //     if (action.type === fetchStatusInfoAggregate.fulfilled.type)
      //       return false
      //     if (action.type === fetchPingValue.pending.type) return false
      //     if (action.type === fetchPingValue.fulfilled.type) return false

      //     return true
      //   },
      // }),
    ),
  ],
})

unsafeWindow.__BETTER_ETORO_UI__ = {
  registeredComponents,
  store,
}

export type RootState = ReturnType<typeof rootReducers>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
