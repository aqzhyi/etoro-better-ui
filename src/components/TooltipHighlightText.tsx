import React from 'react'
import { GM } from '@/GM'

/** @deprecated */
export const HighlightText: React.FC = props => {
  return <span className={HighlightText.name}>{props.children}</span>
}

GM.addStyle(`
  .${HighlightText.name} {
    color: #58b0c8;
    font-weight: bold;
  }
`)
