import {
  fetchStatusInfoAggregate,
  StatusInfoAggregate,
} from '@/actions/fetchStatusInfoAggregate'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { fetchPingValue } from '@/actions/setPingValue'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import {
  BetterEtoroUIConfig,
  storage,
  betterEtoroUIConfigsMiddleware,
} from '@/storage'
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  configureStore,
  createReducer,
} from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { createLogger } from 'redux-logger'
import { registeredComponents } from '@/utils/registerReactComponent'

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
      .addCase(toggleSettingsDialog, (state, action) => {
        state.betterEtoroUISettingsDialog = action.payload
      })
      .addCase(setBetterEtoroUIConfig, (state, action) => {
        state.betterEtoroUIConfig = {
          ...state.betterEtoroUIConfig,
          ...action.payload,
        }
      }),
)

const rootReducers = combineReducers({ settings })

const store = configureStore({
  reducer: rootReducers,
  enhancers: [
    applyMiddleware(
      betterEtoroUIConfigsMiddleware,
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
unsafeWindow['__BETTER_ETORO_UI__'] = {
  registeredComponents,
  store,
}

export type RootState = ReturnType<typeof rootReducers>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
