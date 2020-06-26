import React from 'react'
import { i18n } from '@/i18n'

export const RiskSpecification: React.FunctionComponent<{
  attrs?: Record<string, unknown>
  aClassName?: string
  aStyle?: React.CSSProperties
}> = props => (
  <a
    {...props.attrs}
    className={props.aClassName}
    style={props.aStyle}
    href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3#bce72baccea34ca09f8c3cb2077347d2'
    target='_blank'
  >
    {props.children}
    {i18n.風險說明書()}
  </a>
)
