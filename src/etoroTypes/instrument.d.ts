/**
 * The Stocks, ETFs, and or something else objectives, and their type definitions
 */
declare interface Instrument {
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
