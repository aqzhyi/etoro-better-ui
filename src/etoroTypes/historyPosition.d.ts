declare interface HistoryPosition {
  Amount: number
  CID: number
  /** E.g. `'2021-01-30T13:58:30.6900000Z'` */
  CloseDateTime: string
  ClosePositionActionType: number
  CloseRate: number
  InitialAmountInDollars: number
  InitialUnits: number
  InstrumentID: number
  IsBuy: boolean
  IsPartiallyClosed: boolean
  IsSettled: boolean
  Leverage: number
  MirrorID: number
  NetProfit: number
  /** E.g. `'2021-01-30T12:45:20.0670000Z' */
  OpenDateTime: string
  OpenRate: number
  OrderID: number
  OriginalPositionID: number
  ParentCID: number
  ParentPositionID: number
  PositionID: number
  RedeemStatusID: number
  StopLossRate: number
  TakeProfitRate: number
  TotalFees: number
  Units: number
}
