import toast from 'cogo-toast'

export type BetterEtoroUIConfig = {
  MYR: {
    buy: number
    sell: number
  }
  NTD: {
    buy: number
    sell: number
  }
  useTabKeyBuySell: boolean
  listCompactOn: boolean
  executionMacroEnabled: boolean
  executionAmount: number[]
  executionLever: number[]
  executionAmountLast: number
  executionLeverLast: number
  selectedExchange: 'NTD' | 'MYR' | 'HIDDEN'
  executionUseApplyLast: boolean
  showInvested: boolean
}

export const DEFAULT_CONFIG: BetterEtoroUIConfig = {
  MYR: { buy: 0, sell: 0 },
  NTD: { buy: 0, sell: 0 },
  useTabKeyBuySell: false,
  listCompactOn: false,
  executionMacroEnabled: false,
  executionAmount: [50, 100, 200, 300, 500],
  executionLever: [1, 2, 5, 10, 20],
  executionAmountLast: 200,
  executionLeverLast: 1,
  selectedExchange: 'HIDDEN',
  executionUseApplyLast: false,
  showInvested: false,
}

const CONFIG_STORAGE_KEY = 'better_etoro_ui_config'

export const storage = {
  findConfig: (): typeof DEFAULT_CONFIG => {
    const _config = globalThis.localStorage.getItem(CONFIG_STORAGE_KEY)

    try {
      if (_config) {
        return {
          ...DEFAULT_CONFIG,
          ...JSON.parse(_config),
        } as BetterEtoroUIConfig
      } else {
        return DEFAULT_CONFIG
      }
    } catch (error) {
      error instanceof Error &&
        toast.error(error.message, {
          position: 'bottom-left',
        })
      return DEFAULT_CONFIG
    }
  },
  saveConfig: (config: Partial<BetterEtoroUIConfig>): boolean => {
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
      error instanceof Error &&
        toast.error(error.message, {
          position: 'bottom-left',
        })
      return false
    }
  },
}
