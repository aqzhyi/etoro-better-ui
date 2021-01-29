import produce, { Draft } from 'immer'
import create, { State, StateCreator } from 'zustand'

const immerMiddleware: ImmerMiddleware = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
): StateCreator<T> => (set, get, api) =>
  config(fn => set(produce(fn) as (state: T) => T), get, api)

/** Create a store of zustand */
export const createStore = <StoreStateAndAction extends State>(
  config: ParametersHead<ImmerMiddleware<StoreStateAndAction>>,
) => create<StoreStateAndAction>(immerMiddleware(config))

interface ImmerMiddleware<T extends State = any> {
  (
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
  ): StateCreator<T>
}
