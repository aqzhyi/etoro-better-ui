/**
 * 為數字加上千分位逗號
 *
 * @example
 * toCurrency(1711837993.1415926) // ['1,711,837,993', '14']
 */
export const toCurrency = (
  number: number,
  options?: {
    toFixedLength?: number
  },
) => {
  const defaultsToFixedLength = options?.toFixedLength ?? 2

  const parts = number.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (parts[1]) {
    parts[1] = parts[1].slice(0, defaultsToFixedLength)
  } else {
    parts[1] = ''
  }

  if (defaultsToFixedLength > parts[1].length) {
    parts[1] = `${parts[1]}`.padEnd(defaultsToFixedLength, '0')
  }

  return parts as [string, string]
}
