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
    href='https://www.notion.so/hilezi/df93abe54fb94d9f90f25679957737ef'
    target='_blank'
  >
    {props.children}
    {i18n.風險說明書()}
  </a>
)
