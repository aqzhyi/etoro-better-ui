import React from 'react'
import { Trans, TransProps } from 'react-i18next'
import styled from 'styled-components'
import type * as zhLocale from '../../locales/zh.json'

const RiskLink: React.FC = props => (
  <a
    target='_blank'
    href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3#bce72baccea34ca09f8c3cb2077347d2'
  >
    {props.children}
  </a>
)

const StyledNotable = styled.span`
  color: #58b0c8;
  font-weight: bold;
`

const StyledKbd = styled.kbd`
  box-shadow: 1px 1px 3px 1px #666666;
  padding: 1px 3px;
  font-family: consolas;
  margin: 0 3px;
  border-radius: 3px;
  vertical-align: text-bottom;
  cursor: pointer;
  color: #666;

  :active {
    box-shadow: 1px 1px 3px 1px #333333;
    position: relative;
    top: 1px;
    left: 1px;
  }
`

export const PrimaryTrans: React.FC<
  Omit<TransProps, 'i18nKey'> & {
    i18nKey: keyof typeof zhLocale
  }
> = props => {
  return (
    <Trans
      {...props}
      components={{
        notable: <StyledNotable></StyledNotable>,
        kbd: <StyledKbd></StyledKbd>,
        riskLink: <RiskLink></RiskLink>,
      }}
    >
      {props.children}
    </Trans>
  )
}
