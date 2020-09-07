import type { IRootScopeService, ILocationService } from 'angular'
import { AnyFunction } from 'tsdef'
import { gaAPI } from '~/gaAPI'

export interface InstrumentRate {
  Ask: number
  AskDiscounted: number
  Bid: number
  BidDiscounted: number
  LastAsk: number
  LastBid: number
  LastExecution: number
  /** 看起來是蠟蠋賣出價 */
  lastPrice: number
  lastBidChange: number
  /** 看起來是蠟蠋買入價 */
  lastAskPrice: number
  lastAskChange: number
  /** 差價合約報價 */
  UnitMargin: number
  /** 差價合約槓桿買入價 */
  UnitMarginAsk: number
  /** 差價合約買入折扣價 */
  UnitMarginAskDiscounted: number
  /** 差價合約槓桿賣入價 */
  UnitMarginBid: number
  /** 差價合約賣出折扣價 */
  UnitMarginBidDiscounted: number
}

/**
 * The Stocks, ETFs, and or something else objectives, and their type definitions
 */
export interface Instrument {
  MaxStopLossPercentage: number
  MaxStopLossPercentageLeveragedBuy: number
  MaxStopLossPercentageLeveragedSell: number
  MaxStopLossPercentageNonLeveragedBuy: number
  MaxStopLossPercentageNonLeveragedSell: number
  MaxTakeProfitPercentage: number
  Precision: number
  PriceSource: 'eToro'
  /** e.g `'instrument-100000'` */
  uniqueId: string
  DisplayName: string
  fullName: string
  shortName: string
  ExchangeID: number
  IsActive: boolean
  InstrumentID: number
  instrumentType: {
    InstrumentTypeID: number
    InstrumentTypeDescription: 'Stocks' | string
    PricesBy: 'Xignite' | string
    Avatars: {
      /** as CDN URL */
      default: string
    }
    /** e.g. `'/discover/markets/stocks'` */
    Url: string
  }
  /**
    Available levers which user can to select

    Some instruments leverage can't be select, such as VTI, TLT, QQQ. expect it will return as `[1]`
  */
  Leverages: number[]
  Leverage1MaintenanceMargin: number
  /**
    The native etoro has min position amount on each different instruments
   */
  MinPositionAmount: number
  Name: string
  /** Avatars URLs */
  Avatars: {
    '35x35'?: string
    '50x50'?: string
    '80x80'?: string
    '90x90'?: string
    '150x150'?: string
    default: string
  }
  rate: InstrumentRate
  /** Open the dialog that confirms to close the all trades */
  closeAllTrades(): void
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
export interface InstrumentPosition {
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
  TakeProfitRate: number
  /** e.g. `-0.12` as points */
  LastRateChange: number
  /** 當前價格 */
  CurrentRate: number
  OpenDateTime: Date
  close: AnyFunction
  isPendingClose?: boolean
  StopLossAmount: number
  StopLossPercent: number
  TakeProfitAmount: number
  TakeProfitPercent: number
  getGroup(): {
    FirstOpenDate: Date | null
    /** 可用資金 */
    AvailableAmount: number
    /** 未平倉合約投資額 */
    Amount: number
    GroupName: string
    /** 未平倉盈虧百分比 */
    TotalGain: number
    /** 帳面盈虧金額（含已平倉、未平倉） */
    TotalProfit: number
    /** */
    TotalProfitAndClosedPL: number
    ParentUsername: string
    ClosedPL: number
  }
}

interface EtoroRootScope extends IRootScopeService {
  session: {
    locale: 'en-gb' | 'zh-tw' | 'zh-cn'
    accountMode: 'Demo' | 'Real'
    user: {
      portfolio: {
        api: '/sapi/trade-demo' | '/sapi/trade-real'
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
          Positions: InstrumentPosition[]
        }[]
        /** 掛單倉位 */
        orders: PendingOrder[]
        /** 手動開倉倉位 */
        manualPositions: InstrumentPosition[]
        /** 所有開倉倉位 */
        positions: Partial<{
          [PositionId: string]: InstrumentPosition
        }>
        getPositionById(
          id?: InstrumentPosition['PositionID'],
        ): InstrumentPosition | undefined
      }
    }
    instrumentsFactory: {
      getAll(): {
        [id: number]: Instrument
      }
      /**
       * e.g. `1001` returns instrument of AAPL
       */
      getById(id: Instrument['InstrumentID']): Instrument
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

export interface ExecutionDialogScope extends IRootScopeService {
  /**
    in case such as https://www.etoro.com/app/procharts, didn't has the property `controller`
   */
  controller?: {
    instrument?: Instrument
  }
  /**
    in case such as https://www.etoro.com/app/procharts, didn't has the property `model`
   */
  model?: {
    isCFD: boolean
    /** Will lead the price different */
    isLowLeverage: boolean
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
      inUnitsMode: boolean
      /** Your trade dollar value on execution dialog */
      amount: number
      amountView: number
    }
    leverages: {
      /** Index of selected lever which in list */
      leverageIndex: number
      /** The levers that can be selected */
      leverageList: number[]
      /** Your lever level. e.g. `5` which means with x5 lever */
      selectedLeverage: number
    }
    instrument?: Instrument
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
  selectors: {
    dialogAmountInputSection:
      '[data-etoro-automation-id="execution-amount-input-section"]',
    dialogAmountInput:
      '[data-etoro-automation-id="execution-amount-input-section"] input',
    dialogAmountSteppers: `
       [data-etoro-automation-id="execution-amount-input-section"] .stepper .stepper-minus
      ,[data-etoro-automation-id="execution-amount-input-section"] .stepper .stepper-plus
    `,
    /** The display price value, the value displaying according to BUY and SELL mode */
    dialogPriceDisplayValue: '.execution-main-head-price-value',
    /** e.g. `'X5'` */
    dialogLeverLevelDisplayText:
      '[data-etoro-automation-id="execution-leverage-tab-title-value"]',
    /** The button on the dialog that trigger switch to the amount */
    dialogSwitchToAmountButton:
      '[data-etoro-automation-id="execution-button-switch-to-amount"]',
    /** The button on the dialog that trigger switch to the unit */
    dialogSwitchToUnitButton:
      '[data-etoro-automation-id="execution-button-switch-to-units"]',
    /** The button on the dialog header that trigger switch to the Buy mode */
    dialogBuyButton: '[data-etoro-automation-id="execution-buy-button"]',
    /** The button on the dialog header that trigger switch to the Sell mode */
    dialogSellButton: '[data-etoro-automation-id="execution-sell-button"]',
    /** The inner content of dialog that the border whose user can see */
    dialogInnerContent: '#open-position-view',
    /** The Button to switch tab to the panel of stop-loss input */
    dialogStopLossSwitchTab: '[name="stopLoss"] > a',
    /** The Button to switch tab to the panel of take-profit input */
    dialogTakeProfitSwitchTab: '[name="takeProfit"] > a',
  } as const,
  getDialogLever: () => {
    return angularAPI.executionDialogScope?.model?.leverages.selectedLeverage
  },
  /**
   * Use jQuery to click the real button
   *
   * The way of angular model sync doesn't work for now
   */
  setDialogLever: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    if (dialogScope?.model) {
      const tabEl = $(
        angularAPI.selectors.dialogLeverLevelDisplayText,
      ).parentsUntil('a')

      tabEl.trigger('click')

      $(`.risk-itemlevel:contains(" x${value} ")`).trigger('click')
    }
  },
  getDialogAmount: () => {
    const dialogScope = angularAPI.executionDialogScope

    return dialogScope?.model?.amount.amount
  },
  /**
   * Set amount value with pass number
   *
   * Finally, the value that will be used should respect to Min Position Number and Leverage value
   *
   * The way of angular model sync may cause the function Open Trade fails
   */
  setDialogAmount: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    if (dialogScope?.model) {
      const currentLever = dialogScope?.model?.leverages.selectedLeverage ?? 1

      const etoroMinAmountValue =
        dialogScope?.model?.instrument?.MinPositionAmount ?? value

      const valueWillBe =
        value * currentLever < etoroMinAmountValue ? etoroMinAmountValue : value

      dialogScope.model.amount.inUnitsMode = false
      dialogScope.model.amount.amount = valueWillBe
      dialogScope.model.amount.amountView = valueWillBe

      $(angularAPI.selectors.dialogAmountInput)
        .val(`${valueWillBe}`)
        .delay(50)
        .trigger('change')
        .delay(50)
        .trigger('blur')

      dialogScope.$apply()
    }
  },
  setDialogStopLoss: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    dialogScope?.$applyAsync(() => {
      if (dialogScope?.model) {
        dialogScope.model.stopLoss.inDollarMode = true
        dialogScope.model.stopLoss.defaultPercent = value
      }
    })

    dialogScope?.$apply()
  },
  setDialogTakeProfit: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    dialogScope?.$applyAsync(() => {
      if (dialogScope?.model) {
        dialogScope.model.takeProfit.inDollarMode = true
        dialogScope.model.takeProfit.defaultPercent = value
      }
    })
    dialogScope?.$apply()
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
      [automation-id="watchlist-item-list-instrument-wrapp-rate-change"],
      [automation-id="watchlist-item-list-instrument-sentiment"],
      et-fifty-two-weeks,
      [automation-id="watchlist-item-list-user-wrapp-investors"]
      `,
    ).toggle(!onOff)
  },
  /** 打開關注列表的第一個商品的交易視窗，適用於「關注列表的過濾功能」 */
  openTradeDialog: () => {
    $('[automation-id="buy-sell-button-container-buy"]:visible')
      /** the user may enable the "One-Click Trade", so there to avoid the hit on the mistake */
      .not('.one-click')
      .eq(0)
      .trigger('click')
  },
}
