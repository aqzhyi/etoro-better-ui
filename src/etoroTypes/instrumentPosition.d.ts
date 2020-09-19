/**
 * All of Positions which you had the ordered of Stocks, ETFs, and or something else objectives, and their type definitions
 */
declare interface InstrumentPosition {
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
