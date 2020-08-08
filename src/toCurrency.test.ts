import { toCurrency } from '@/toCurrency'
import { random } from 'lodash'

test('Normal Usage', () => {
  for (let index = 0; index < 100; index++) {
    const value = random(100000, 1000, true)
    const valueMutated = toCurrency(value)

    expect(valueMutated).toHaveLength(2)
    expect(valueMutated[0].length).toBeLessThanOrEqual(6)
    expect(valueMutated[0].length).toBeGreaterThan(4)
    expect(valueMutated[1].length).toBe(2)
  }
})

test('toFixedLength defaults: 2', () => {
  expect(toCurrency(1000.1111)[1]).toBe('11')
  expect(toCurrency(1000.11)[1]).toBe('11')
  expect(toCurrency(1000)[1]).toBe('00')
})

test('toFixedLength try: 4, expected pad end with 0 string', () => {
  const options: Parameters<typeof toCurrency>[1] = {
    toFixedLength: 4,
  }

  expect(toCurrency(1000.1111, options)[1]).toBe('1111')
  expect(toCurrency(1000.11, options)[1]).toBe('1100')
  expect(toCurrency(1000, options)[1]).toBe('0000')
})

test('toFixedLength try: 0, expected empty string', () => {
  const options: Parameters<typeof toCurrency>[1] = {
    toFixedLength: 0,
  }

  expect(toCurrency(1000.1111, options)[1]).toBe('')
  expect(toCurrency(1000.11, options)[1]).toBe('')
  expect(toCurrency(1000, options)[1]).toBe('')
})
