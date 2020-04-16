import { exchange } from './exchange'

export const localStorage = {
  getSelectedExchange: () =>
    (globalThis.localStorage.getItem('selected_exchange') ||
      'NTD') as typeof exchange['selected'],
  setSelectedExchange: (value: typeof exchange['selected']) =>
    globalThis.localStorage.setItem('selected_exchange', value),
}
