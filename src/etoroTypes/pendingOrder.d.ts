/**
 * The Pending Orders of Stocks, ETFs, and or something else objectives, and their type definitions
 */
declare interface PendingOrder {
  Amount: number
  Instrument: Instrument
  CurrentRate: number
  Leverage: number
  /** e.g. `'order-234700888'` */
  UniqueId: string
}
