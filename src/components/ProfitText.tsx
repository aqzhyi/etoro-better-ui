import { makeStyles } from '@material-ui/core'
import cxx from 'classnames'
import React, { memo, useMemo } from 'react'
import { toCurrency } from '~/toCurrency'

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
  /**
    @example
    '%' // 777.77%
   */
  suffix?: React.ReactNode
}> = memo(function ProfitText(props) {
  const isNegative = props.profit < 0
  const negativeSymbol = props.noNegative ? '' : '-'
  const css = useStyled()

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
        [css.root]: true,
        [css.takingLoss]: !props.pureDollar && isNegative,
        [css.takingProfit]: !props.pureDollar && !isNegative,
        [css.asColorYellow]: props.pureDollar,
      })}
    >
      <span className={`${ProfitText.name}__dollarPrefix`}>{dollarPrefix}</span>
      <span className={css.mainValue}>
        {isNegative}
        {values[0]}
      </span>
      <span className={css.secondaryValue}>.{values[1]}</span>
      <span>{props.suffix}</span>
    </span>
  )
})

const useStyled = makeStyles({
  root: {
    fontWeight: 700,
  },
  takingProfit: {
    color: '#6eaf0f',
  },
  takingLoss: {
    color: '#e1191d',
  },
  asColorYellow: {
    color: 'orange',
  },
  mainValue: {},
  secondaryValue: {
    fontSize: '0.75em',
  },
})
