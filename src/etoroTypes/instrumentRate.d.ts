declare interface InstrumentRate {
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
