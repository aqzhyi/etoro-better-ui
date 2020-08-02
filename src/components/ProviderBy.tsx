import React from 'react'
import { i18n } from '@/i18n'
import { GM } from '@/GM'

export const ProviderBy = () => (
  <span className='HelperContent'>
    {i18n.universal_extensionSupportName_text(() => (
      <a
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        target='_blank'
        tabIndex={-1}
      >
        better-etoro-ui
      </a>
    ))}
  </span>
)

GM.addStyle(`
  .HelperContent {
    color: #cccccc;
    font-size: 8pt;
    font-weight: 100;
  }
`)
