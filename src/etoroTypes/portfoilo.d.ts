declare interface Portfoilo {
  availibleToTrade: number
  balance: number
  equity: number
  groups: unknown[]
  lostPositionsManager: unknown
  manualPositions: unknown
  orders: unknown[]
  ordersTotalAmount: number
  positions: Record<InstrumentPosition['PositionID'], unknown>
  realizedEquity: number
  totalGain: number
  totalInvestedAmount: number
  totalInvestedAmountIncludingMirrorsProfit: number
  totalProfit: number
}
