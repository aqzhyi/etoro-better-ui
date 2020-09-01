import {
  applyMiddleware,
  combineReducers,
  configureStore,
  createReducer,
} from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  fetchStatusInfoAggregate,
  StatusInfoAggregate,
} from '~/actions/fetchStatusInfoAggregate'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { setGroupPositionIds } from '~/actions/setGroupPositionIds'
import { fetchPingValue } from '~/actions/setPingValue'
import { toggleSettingsDialog } from '~/actions/toggleSettingsDialog'
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
      .addCase(fetchStatusInfoAggregate.fulfilled, (state, action) => {
        state.statusCheckAggregate = action.payload
      }),
)

const display = createReducer<{
  betterEtoroUISettingsDialog: boolean
}>({ betterEtoroUISettingsDialog: false }, builder =>
  builder.addCase(toggleSettingsDialog, (state, action) => {
    state.betterEtoroUISettingsDialog = action.payload
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
  ids: number[]
}>({ ids: [] }, builder =>
  builder.addCase(setGroupPositionIds, (state, action) => {
    state.ids = action.payload
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
