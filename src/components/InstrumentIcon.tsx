import React from 'react'
import { Instrument } from '~/angularAPI'
import styled from 'styled-components'

const Box = styled.span<{
  url: string
}>`
  display: inline-block;
  position: relative;
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 30px;
  width: 30px;
`

const Name = styled.span`
  display: inline-block;
  position: relative;
  text-shadow: 1px 1px 2px #c5c5c5;
  font-size: 12px;
  color: #000;
  position: absolute;
  top: 20px;
`

export const InstrumentIcon: React.FC<{
  instrument: Instrument
}> = props => {
  return (
    <Box
      url={
        props.instrument.Avatars['90x90'] || props.instrument.Avatars.default
      }
    >
      <Name>{props.instrument.Name}</Name>
    </Box>
  )
}
