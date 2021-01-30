import Big from 'big.js'

export const getChangePoints = (value: number, precision?: number) => {
  if (value === 0) {
    return 0
  }

  const valueAsString = value.toString().split('.')
  const _precision = precision ?? valueAsString?.[1]?.length ?? 0

  const _value = Big(
    Number(
      `${valueAsString[0]}${valueAsString[1]?.padEnd(_precision, '0') || ''}`,
    ),
  )

  return _value.toNumber()
}
