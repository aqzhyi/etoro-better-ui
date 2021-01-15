import toast from 'cogo-toast'

export type BetterEtoroUIConfig = {
  /** If you want to show your portfolio to somebody, but not your account name */
  demoMode: boolean
  /** Trade Dashboard the positions the rate of refresh profits */
  tradeDashboardRenderRate: number
  tradeDialogPriceRenderRate: number | null
  useHotkeys: {
    key12345?: boolean
    /** The hotkey to trigger Open Trade */
    dialogOpenTrade?: ' ' | null
    /** The hotkey to trigger Buy and Sell switch */
    dialogBuySellSwitch?: 'Tab' | null
    /** The hotkey to trigger Dialog to close */
    dialogClose?: 'Esc' | null
    /** The hotkey to trigger focus on filter input that on the watchlist */
    watchlistFilter?: 'F' | null
  }
  /**
   * The SECONDS interval expected used to checking delay ms and the Manual
   * trading working status which fetch from etoro status site.
   */
  intervalCheckingStatus: number
  googleAnalyticsEnabled: boolean
  stopLossLastPercent: number
  takeProfitLastPercent: number
  MYR: {
    buy: number
    sell: number
  }
  NTD: {
    buy: number
    sell: number
  }
  listCompactOn: boolean
  executionMacroEnabledInProchart: boolean
  executionMacroEnabled: boolean
  executionAmount: number[]
  executionAmountLast: number
  executionLeverLast: number
  selectedExchange: 'NTD' | 'MYR' | 'HIDDEN'
  executionUseApplyLast: boolean
  showInvested: boolean
}

export const DEFAULT_CONFIG: BetterEtoroUIConfig = {
  demoMode: false,
  tradeDashboardRenderRate: 2500,
  tradeDialogPriceRenderRate: 500,
  useHotkeys: {
    key12345: true,
    dialogBuySellSwitch: 'Tab',
    dialogClose: 'Esc',
    /** Default to disabled, to avoid users trigger on unexpected */
    dialogOpenTrade: null,
    watchlistFilter: 'F',
  },
  intervalCheckingStatus: 30,
  googleAnalyticsEnabled: true,
  stopLossLastPercent: 100,
  takeProfitLastPercent: 100,
  MYR: { buy: 0, sell: 0 },
  NTD: { buy: 0, sell: 0 },
  listCompactOn: false,
  executionMacroEnabledInProchart: false,
  executionMacroEnabled: true,
  executionAmount: [50, 100, 200, 300, 500],
  executionAmountLast: 200,
  executionLeverLast: 1,
  selectedExchange: 'NTD',
  executionUseApplyLast: true,
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
          position: 'top-right',
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
      globalThis.localStorage.setItem(CONFIG_STORAGE_KEY, _config)
      return true
    } catch (error) {
      error instanceof Error &&
        toast.error(error.message, {
          position: 'top-right',
        })
      return false
    }
  },
}
