import toast from 'cogo-toast'
import { Middleware } from 'redux'
import { PayloadAction } from '@reduxjs/toolkit'
import { debugAPI } from '~/debugAPI'
import { emitter, Events } from '~/emitter'

export type BetterEtoroUIConfig = {
  /** Trade Dashboard the positions the rate of refresh profits */
  tradeDashboardRefreshRate: number
  showTradeDashboard: boolean
  /** 掌聲高聲歡呼之精采程度 */
  inviteExcitingDegree: number | null
  useHotkeys: {
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
   * The SECONDS interval expected used to checking delay ms and the
   * Manual trading working status which fetch from etoro status site.
   */
  intervalCheckingStatus: number
  googleAnalyticsEnabled: boolean
  stopLossAndTakeProfitUseLastPercent: boolean
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
  executionLever: number[]
  executionAmountLast: number
  executionLeverLast: number
  selectedExchange: 'NTD' | 'MYR' | 'HIDDEN'
  executionUseApplyLast: boolean
  showInvested: boolean
}

export const DEFAULT_CONFIG: BetterEtoroUIConfig = {
  tradeDashboardRefreshRate: 2500,
  showTradeDashboard: false,
  inviteExcitingDegree: null,
  useHotkeys: {},
  intervalCheckingStatus: 15,
  googleAnalyticsEnabled: true,
  stopLossAndTakeProfitUseLastPercent: false,
  stopLossLastPercent: 50,
  takeProfitLastPercent: 5,
  MYR: { buy: 0, sell: 0 },
  NTD: { buy: 0, sell: 0 },
  listCompactOn: false,
  executionMacroEnabledInProchart: false,
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
