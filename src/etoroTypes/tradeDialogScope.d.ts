declare interface TradeDialogScope extends IRootScopeService {
  /**
   * In case such as https://www.etoro.com/app/procharts, didn't has the
   * property `controller`
   */
  controller?: {
    instrument?: Instrument
  }
  /** In case such as https://www.etoro.com/app/procharts, didn't has the property `model` */
  model?: {
    orderModeCurrentRate?: number
    isBuy: boolean
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
      isLimitLessReachable: boolean
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
    position: InstrumentPosition | null
  }
  /** 開倉下單 */
  openOrder(): unknown
}
