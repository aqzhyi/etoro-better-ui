import { GM } from '~/GM'
import { toCurrency } from '~/toCurrency'
import React, { useMemo } from 'react'
import cxx from 'classnames'

export const ProfitText: React.FC<{
  /**
    This prop allows be a negative number

    @example
    777.771257325 // $777.77

    @example
    -777.771257325 // -$777.77
  */
  profit: number
  /**
    Define component present for either as Pure Dollar Display

    @example
    false | undefined // present as green or red

    @example
    true // present as yellow
  */
  pureDollar?: boolean
  /**
    Define component present a Dollar Sign as a prefix

    @example
    false // 777.77

    @example
    true // $777.77
   */
  noDollarSign?: boolean
  /**
    Controls whether negative symbol should be showm or not
   */
  noNegative?: boolean
}> = props => {
  const isNegative = props.profit < 0
  const negativeSymbol = props.noNegative ? '' : '-'

  const values = useMemo(() => {
    const value = Math.abs(props.profit)

    const defaultsToFixedLength = 2

    return toCurrency(Number(value), {
      toFixedLength: defaultsToFixedLength,
    })
  }, [props])

  const dollarPrefix = props.noDollarSign
    ? isNegative
      ? negativeSymbol
      : ''
    : isNegative
    ? `${negativeSymbol}$`
    : '$'

  return (
    <span
      data-testid='root'
      className={cxx({
        [ProfitText.name]: true,
        [`${ProfitText.name}__red`]: !props.pureDollar && isNegative,
        [`${ProfitText.name}__green`]: !props.pureDollar && !isNegative,
        [`${ProfitText.name}__yellow`]: props.pureDollar,
      })}
    >
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
  .${ProfitText.name} {
    font-weight: 700;
  }

  .${ProfitText.name}__red {
    color: #e1191d;
  }

  .${ProfitText.name}__green {
    color: #6eaf0f;
  }

  .${ProfitText.name}__yellow {
    color: orange;
  }

  .${ProfitText.name}__valueSmall {
    font-size: 0.75em;
  }
`)
