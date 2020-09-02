import React from 'react'
import styled, { keyframes } from 'styled-components'

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

/**
 * the styles for Kbd is copying from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 */
const StyledKbd = styled.kbd<{
  active: boolean
}>`
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-family: consolas, 'Liberation Mono', courier, monospace;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
  margin: auto 3px;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  box-shadow: ${props => (props.active ? `1px 1px 3px 1px #333333;` : 'auto')};
  animation-name: ${props => (props.active ? Spin : 'auto')};
`

export const Kbd: React.FC<{
  pressing?: boolean
}> = props => {
  return <StyledKbd active={props.pressing}>{props.children}</StyledKbd>
}
