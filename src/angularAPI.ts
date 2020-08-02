import type { IRootScopeService, ILocationService } from 'angular'
import store from '@/store/_store'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

/**
 * The Stocks, ETFs, and or something else objectives, and their type definitions
 */
export interface Instrument {
  DisplayName: string
  fullName: string
  shortName: string
  ExchangeID: number
  InstrumentID: number
  Name: string
  Leverage1MaintenanceMargin: number
  /** Avatars URLs */
  Avatars: {
    '35x35': string
    '50x50': string
    '80x80': string
    '90x90': string
    '150x150': string
    default: string
  }
}

/**
 * The Pending Orders of Stocks, ETFs, and or something else objectives, and their type definitions
 */
export interface PendingOrder {
  Amount: number
  Instrument: Instrument
  CurrentRate: number
  Leverage: number
  /** e.g. `'order-234700888'` */
  UniqueId: string
}

/**
 * All of Positions which you had the ordered of Stocks, ETFs, and or something else objectives, and their type definitions
 */
export interface Position {
  Amount: number
  /** 倉位淨值 */
  Equity: number
  /** 初始投資金額 */
  InitialAmountInDollars: number
  /** 初始投資單位 */
  InitialUnits: number
  IsBuy: boolean
  PositionID: number
  OpenRate: number
  Profit: number
  Leverage: number
  Instrument: Instrument
  /** 當前價格 */
  CurrentRate: number
  OpenDateTime: Date
}

interface EtoroRootScope extends IRootScopeService {
  session: {
    locale: 'en-gb' | 'zh-tw' | 'zh-cn'
    accountMode: 'Demo' | 'Real'
    user: {
      portfolio: {
        /** 可用餘額 */
        availibleToTrade: number
        /** 淨值 */
        equity: number
        /** 利潤 */
        totalProfit: number
        /** 總配額 */
        totalInvestedAmount: number
        /** 所有開倉位（按 Instrument 分組） */
        groups?: {
          /** 標的名稱 */
          GroupName: string
          Amount: number
          /** 標的圖示 */
          Avatar: string
          AverageOpenRate: number
          /** 當前淨值 */
          Equity: number
          FirstOpenDate: Date
          InstrumentID: number
          Instrument: Instrument
          /** e.g. `-8.578` 代表全部倉位損益 -0.86% */
          TotalGain: number
          /** e.g. `-10.458636130000016` 代表全部倉位損益 -10.45$USD */
          TotalProfit: number
          /** 當前倉位 */
          Positions: Position[]
        }[]
        /** 掛單倉位 */
        orders: PendingOrder[]
        /** 手動開倉倉位 */
        manualPositions: Position[]
      }
    }
  }
  layoutCtrl: { $location: ILocationService } & {
    isBannerShown: boolean
    isLoaded: boolean
    isMobile: boolean
    isWrapper: boolean
    showFooter: boolean
    showLoginButton: boolean
    uiDialog: {
      isDialogOpen: boolean
      isKycDialogOpen: boolean
      latestID: string
    }
  }
}

interface ExecutionDialogScope extends IRootScopeService {
  controller: {
    instrument: Instrument
  }
  model: {
    stopLoss: {
      /** Take how much amount of Loss dollar */
      amount: number
      defaultPercent: number
      dollar: number
      dollarView: number
      inDollarMode: boolean
      isLimitLessReachable: boolean
      isNoStopLossSet: boolean
      percentAmount: number
    }
    takeProfit: {
      /** Take how much amount of Profit dollar */
      amount: number
      defaultPercent: number
      dollar: number
      dollarView: number
      inDollarMode: boolean
      isLimitLessReachable
      isNoTakeProfitSet: boolean
      percentAmount: number
    }
    amount: {
      /** Your trade dollar value on execution dialog */
      amount: number
    }
  }
  /** 開倉下單 */
  openOrder(): unknown
}

export const angularAPI = {
  _$rootScope: null as EtoroRootScope | null,
  get $rootScope() {
    if (this._$rootScope) {
      return this._$rootScope
    }
    const $rootScope = (($('body').scope?.() as unknown) ||
      null) as EtoroRootScope | null
    this._$rootScope = $rootScope
    return $rootScope
  },
  get executionDialogScope() {
    return ($('.execution-head').scope?.() as unknown) as
      | ExecutionDialogScope
      | undefined
  },
  setDialogStopLoss: (lossPercent: number) => {
    angularAPI.executionDialogScope?.$apply(() => {
      if (angularAPI.executionDialogScope) {
        angularAPI.executionDialogScope.model.stopLoss.inDollarMode = true
        angularAPI.executionDialogScope.model.stopLoss.defaultPercent = lossPercent
      }
    })
  },
  setDialogTakeProfit: (profitPercent: number) => {
    angularAPI.executionDialogScope?.$apply(() => {
      if (angularAPI.executionDialogScope) {
        angularAPI.executionDialogScope.model.takeProfit.inDollarMode = true
        angularAPI.executionDialogScope.model.takeProfit.defaultPercent = profitPercent
      }
    })
  },
  /** Expected effecting with list history and Portfolio also including people's history and Portfolio */
  filterPortfolioListByText: (filterText = '') => {
    if (filterText) {
      $('.ui-table-row').hide()

      $(
        '.table-first-name, .table-last-name, .i-portfolio-table-name-symbol, .ui-table-row',
      ).each((index, element) => {
        const didMatch = element.innerHTML
          .trim()
          .toLowerCase()
          .replace(/[\s]*/gi, '')
          .includes(filterText.toLowerCase().trim())

        if (didMatch) {
          $(element).closest('.ui-table-row').show()
        }
      })
    } else {
      $('.ui-table-row').show()
    }
  },
  /** Expected effecting with list People, Instruments that you watching */
  filterWatchlistByText: (filterText = '') => {
    if (filterText) {
      $(
        'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
      ).hide()

      $(
        '[automation-id=trade-item-name], [automation-id="trade-item-full-name"]',
      ).each((index, element) => {
        const didMatch = element.innerText
          .trim()
          .toUpperCase()
          .includes(filterText.trim().toUpperCase())

        if (didMatch) {
          $(element)
            .closest(
              'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
            )
            .show()
        }
      })
    } else {
      $(
        'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
      ).show()
    }
  },
  /** Expected effecting with list People and Instruments that you invested */
  toggleListInvested: (onOff: boolean) => {
    if (onOff) {
      $('et-instrument-row, et-user-row').hide()
      $('.instrument-list-pie-link')
        .closest('et-instrument-row, et-user-row')
        .show()
    } else {
      $('et-instrument-row, et-user-row').show()
    }
  },
  /** Expected effecting with list People and Instruments that you watching */
  toggleListCompact: (onOff: boolean) => {
    $(
      `
      [automation-id="watchlist-item-list-instrument-chart"],
      [automation-id="watchlist-item-list-instrument-sentiment"],
      et-fifty-two-weeks,
      [automation-id="watchlist-item-list-user-wrapp-investors"]
      `,
    ).toggle(!onOff)
  },
}
