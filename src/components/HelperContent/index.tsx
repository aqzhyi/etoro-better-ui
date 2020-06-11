import * as React from 'react'
import { GM } from '../../GM'
import { i18n } from '@/i18n'

const RiskSpecification: React.FunctionComponent<{
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

const com = {
  RiskSpecification,
  WhoDeveloper: () => (
    <span className='HelperContent'>
      {i18n.功能提供者述敘(() => (
        <a
          href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
          target='_blank'
        >
          better-etoro-ui
        </a>
      ))}
    </span>
  ),
}

GM.addStyle(`
  .HelperContent {
    color: #cccccc;
    font-size: 8pt;
    font-weight: 100;
  }
`)

export default com
