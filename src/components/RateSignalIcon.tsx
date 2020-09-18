import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core'

/**
  信號燈

  用來顯示商品上漲或下跌訊號。

  傳入正數代表上漲，傳入負數代表下跌，非正數也非負數則代表平。

  @example
  12.04
  // show 🟢

  @example
  -12.04
  // show 🔴

  @example
  0
  // show ➖
 */
export const RateSignalIcon: React.FC<{
  /** According to the number value, negative show red, positive show green */
  change: number
}> = memo(props => {
  const css = useStyled()

  return (
    <span className={css.root}>
      {props.change > 0 ? '🟢' : props.change < 0 ? '🔴' : '➖'}
    </span>
  )
})

const useStyled = makeStyles({
  root: {
    display: 'inline-block',
    padding: '0 4px',
    width: 28,
  },
})
