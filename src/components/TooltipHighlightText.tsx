import React from 'react'
import { GM } from '@/GM'

export const TooltipHighlightText: React.FC = props => {
  return <span className={TooltipHighlightText.name}>{props.children}</span>
}

GM.addStyle(`
  .${TooltipHighlightText.name} {
    color: #58b0c8;
    font-weight: bold;
  }
`)
