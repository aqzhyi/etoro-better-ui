import React from 'react'
import styled from 'styled-components'

const Box = styled.span`
  display: flex;
  padding: 0 4px;
  width: 28px;
`

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
