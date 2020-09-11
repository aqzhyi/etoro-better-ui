/**
 * The TakeProfit/StopLoss values of etoro, it has the error gap, usually in 1.5%
 *
 * if return `true` means the value should be expected, and it's may in error gap
 *
 * if return `false` means the value should NOT match the setting of etoro-better-ui,
 * the value may reaching the limit of that on angular scope of etoro.
 */
export const checkInErrorGap = (
  value?: number,
  expected?: number,
  options?: {
    /**
     * expected error gap
     *
     * `1.5` means 1.5%
     *
     * @default 1.5
     */
    errorGapInPercents?: number
  },
) => {
  const errorGapInPercents = options?.errorGapInPercents ?? 1.5

  if (!value || !expected) {
    return false
  }

  /**
   * `0` means value has no gap
   *
   * `10` means value has 10% gap
   */
  const gap = Math.abs(1 - value / expected) * 100

  return errorGapInPercents > gap
}
