import { GM } from '@/GM'
import { toCurrency } from '@/toCurrency'
import React, { useMemo } from 'react'

export const ProfitText: React.FC<{
  /**
    allow be negative number

    @example
    777.771257325

    @example
    -777.771257325
  */
  profit: number
  /**
    Define component present for either as Pure Dollar Display

    @example
    false | undefined

    // present as green color when value >= 0

    // present as red color when value < 0

    @example
    true

    // present either as not green but also not red
  */
  pureDollar?: boolean
  /**
    Define component present a Dollar Sign as a prefix

    @example
    false

    // 777.77

    @example
    true

    // $777.77
   */
  noDollarSign?: boolean
}> = props => {
  const isNegative = props.profit < 0

  const values = useMemo(() => {
    const value = Math.abs(props.profit)

    const floatingLength = value.toString().split('.')[1]?.length
    const defaultsToFixedLength = floatingLength > 2 ? 4 : 2

    return toCurrency(Number(value), {
      toFixedLength: defaultsToFixedLength,
    })
  }, [props])

  const dollarPrefix = props.noDollarSign
    ? isNegative
      ? '-'
      : ''
    : isNegative
    ? '-$'
    : '$'

  const styles: React.CSSProperties = {
    color:
      props.pureDollar === true
        ? 'orange'
        : !isNegative
        ? '#6eaf0f'
        : '#e1191d',
    fontWeight: 'bold',
  }

  return (
    <span style={styles}>
      <span className={`${ProfitText.name}__dollarPrefix`}>{dollarPrefix}</span>
      <span className={`${ProfitText.name}__valueMain`}>
        {isNegative}
        {values[0]}
      </span>
      <span className={`${ProfitText.name}__valueSmall`}>.{values[1]}</span>
    </span>
  )
}

GM.addStyle(`
  .${ProfitText.name}__valueSmall {
    font-size: 0.75em;
  }
`)
