/**
  @example
  '$7,777.77'

  // 7777.77

  @example
  undefined

  // 0
*/
export const currencyTextToNumber = (text?: string) => {
  if (!text) {
    return 0
  }

  return Number(text?.replace(/[$,]/gi, '').trim())
}
