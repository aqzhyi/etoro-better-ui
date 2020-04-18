import { exchange } from './exchange'

export const localStorage = {
  getExecutionMacroEnabled() {
    return globalThis.localStorage.getItem(
      'etoro_better_ui_execution_macro_enabled',
    ) === 'true'
      ? true
      : false
  },
  setExecutionMacroEnabled(value: boolean) {
    globalThis.localStorage.setItem(
      'etoro_better_ui_execution_macro_enabled',
      `${value}`,
    )
  },
  getSelectedExchange: () =>
    (globalThis.localStorage.getItem('selected_exchange') ||
      'NTD') as typeof exchange['selected'],
  setSelectedExchange: (value: typeof exchange['selected']) =>
    globalThis.localStorage.setItem('selected_exchange', value),
}
