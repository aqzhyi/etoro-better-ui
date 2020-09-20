import { styled } from '@material-ui/core'
import React, { memo } from 'react'
import { useInstrument } from '~/hooks/useInstrument'

const Root = styled('div')({
  display: 'inline-block',
  position: 'relative',
  backgroundImage: (props: { url: string }) => `url(${props.url})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  height: 30,
  width: 30,
  outline: '1px solid #b7b7b7',
})

const Name = styled('div')({
  display: 'inline-block',
  textShadow: '1px 1px 2px #c5c5c5',
  fontSize: 12,
  color: '#000',
  position: 'absolute',
  top: 22,
  left: -10,
})

export const InstrumentIcon: React.FC<{
  id: Instrument['InstrumentID']
}> = memo(function InstrumentIcon(props) {
  const instrument = useInstrument(props.id)

  return (
    <Root
      url={instrument?.Avatars['90x90'] || instrument?.Avatars.default || ''}
    >
      <Name>{instrument?.Name}</Name>
    </Root>
  )
})
