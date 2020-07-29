import type { IRootScopeService, ILocationService } from 'angular'
import store from '@/store/_store'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

interface Instrument {
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
        groups: any[]
        /** 掛單倉位 */
        orders: {
          Instrument: Instrument
          CurrentRate: number
          Leverage: number
        }[]
        /** 手動開倉倉位 */
        manualPositions: {
          OpenDateTime: Date
          OpenRate: number
          Profit: number
          Instrument: Instrument
          /** 淨值 */
          Equity: number
          /** 當前價格 */
          CurrentRate: number
          /** 投資 */
          Amount: number
          /** 初始投資金額 */
          InitialAmountInDollars: number
          /** 初始投資單位 */
          InitialUnits: number
        }[]
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
}

export const angularAPI = {
  _$rootScope: null as EtoroRootScope | null,
  get $rootScope() {
    if (this._$rootScope) {
      return this._$rootScope
    }
    const $rootScope = ($('body').scope() as unknown) as EtoroRootScope
    this._$rootScope = $rootScope
    return $rootScope
  },
  get executionDialogScope() {
    return ($('.execution-head').scope() as unknown) as
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
