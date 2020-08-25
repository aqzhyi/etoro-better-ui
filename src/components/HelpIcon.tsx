import { GM } from '~/GM'
import { Icon } from '@fluentui/react'
import React from 'react'

export const HelpIcon: React.FC<{
  notionHref: string
}> = props => {
  return (
    <a className={HelpIcon.name} target='_blank' href={props.notionHref}>
      <Icon iconName='FeedbackRequestSolid'></Icon>
    </a>
  )
}

GM.addStyle(`
  .${HelpIcon.name} {
    margin-left: 4px;
    margin-right: 4px;
    vertical-align: middle;
  }
`)
