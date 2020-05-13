import { exchange } from './exchange'
import toast from 'cogo-toast'

type BetterEtoroUIConfig = {
  executionMacroEnabled: boolean
  selectedExchange: 'NTD' | 'MYR'
}

const findLegacyConfig = () => {
  const rawEtoroBetterUiExecutionMacroEnabled = globalThis.localStorage.getItem(
    'etoro_better_ui_execution_macro_enabled',
  ) as 'false' | 'true' | null
  const rawSelectedExchange = globalThis.localStorage.getItem(
    'selected_exchange',
  ) as 'NTD' | 'MYR' | null

  return {
    executionMacroEnabled: JSON.parse(
      rawEtoroBetterUiExecutionMacroEnabled || 'false',
    ),
    selectedExchange: rawSelectedExchange || 'NTD',
  } as BetterEtoroUIConfig
}

const DEFAULT_CONFIG: BetterEtoroUIConfig = {
  executionMacroEnabled: findLegacyConfig().executionMacroEnabled ?? false,
  selectedExchange: findLegacyConfig().selectedExchange ?? 'NTD',
}

const CONFIG_STORAGE_KEY = 'better_etoro_ui_config'

export const storage = {
  findConfig: () => {
    const _config = globalThis.localStorage.getItem(CONFIG_STORAGE_KEY)

    try {
      if (_config) {
        return JSON.parse(_config) as BetterEtoroUIConfig
      } else {
        return DEFAULT_CONFIG
      }
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-left',
      })
      return DEFAULT_CONFIG
    }
  },
  saveConfig: (config: Partial<BetterEtoroUIConfig>) => {
    const _config = JSON.stringify({
      ...storage.findConfig(),
      ...config,
    })

    try {
      // remove legacies
      globalThis.localStorage.removeItem(
        'etoro_better_ui_execution_macro_enabled',
      )
      globalThis.localStorage.removeItem('selected_exchange')
      //

      globalThis.localStorage.setItem(CONFIG_STORAGE_KEY, _config)
      return true
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-left',
      })
      return false
    }
  },
}
