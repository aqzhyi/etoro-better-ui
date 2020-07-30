import React from 'react'

export const ProfitText: React.FC<{
  /** allow be negative number */
  profit: number
}> = props => {
  const isNegative = props.profit < 0
  const profit = Math.abs(props.profit)

  const dollarPrefix = isNegative ? '-$' : '$'

  const styles: React.CSSProperties = {
    color: !isNegative ? '#6eaf0f' : '#e1191d',
    fontWeight: 'bold',
  }

  return (
    <span style={styles}>
      {dollarPrefix}
      {profit.toFixed(2)}
    </span>
  )
}
