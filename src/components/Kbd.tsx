import React from 'react'
import styled from 'styled-components'

export const Kbd = styled.kbd`
  box-shadow: 1px 1px 3px 1px #666666;
  padding: 1px 3px;
  font-family: consolas;
  margin: 0 3px;
  border-radius: 3px;
  vertical-align: text-bottom;
  cursor: pointer;
  color: #666;
  background-color: #fff;

  :active {
    box-shadow: 1px 1px 3px 1px #333333;
    position: relative;
    top: 1px;
    left: 1px;
  }
`
