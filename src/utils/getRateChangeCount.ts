/**
 * Useful to count the diff of openRate and currentRate for instrument position
 *
 * * Your BUY position that the open rate is 10000 and current rate is 10030, count the value as 30
 * * Your SELL position that the open rate is 10000 and current rate is 10030, count the value as -30
 */
export const getRateChangeCount = (
  isBuy: boolean,
  openRate: number,
  currentRate: number,
  toFixed = 2,
) => {
  return (isBuy ? currentRate - openRate : openRate - currentRate).toFixed(
    toFixed,
  )
}
