import * as React from 'react'
import { GM } from '../../GM'

const com = {
  RiskSpecification: () => (
    <span>
      <a
        style={{ color: 'blue' }}
        href='https://www.notion.so/hilezi/df93abe54fb94d9f90f25679957737ef'
        target='_blank'
      >
        風險說明書
      </a>
    </span>
  ),
  WhoDeveloper: () => (
    <span className='HelperContent'>
      本功能由{' '}
      <a
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        target='_blank'
      >
        better-etoro-ui
      </a>{' '}
      提供
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
