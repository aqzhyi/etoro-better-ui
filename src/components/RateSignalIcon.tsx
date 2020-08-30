import React from 'react'
import styled from 'styled-components'

const Box = styled.span`
  display: inline-flex;
  padding: 0 4px;
  width: 28px;
`

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
}> = props => {
  if (props.change > 0) {
    return <Box>🟢</Box>
  }

  if (props.change < 0) {
    return <Box>🔴</Box>
  }

  return <Box>➖</Box>
}
