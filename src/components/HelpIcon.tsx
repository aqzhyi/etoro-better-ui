import { Icon } from '@fluentui/react'
import React from 'react'

export const HelpIcon: React.FC<{
  notionHref: string
}> = props => {
  return (
    <a target='_blank' href={props.notionHref}>
      <Icon iconName='FeedbackRequestSolid'></Icon>
    </a>
  )
}
