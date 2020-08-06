import { debugAPI } from './debugAPI'

/**
 * 為數字加上千分位逗號
 *
 * @example
 * toCurrency(1711837993.1415926) // ['1,711,837,993', '14']
 */
export const toCurrency = (number: number) => {
  const parts = number.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2)
    parts[1] = parts[1].length === 1 ? parts[1] + '0' : parts[1]
  } else {
    parts[1] = '00'
  }

  return parts as [string, string]
}
