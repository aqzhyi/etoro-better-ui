import { GM } from '~/GM'
import React from 'react'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'

export const HelpIcon: React.FC<{
  notionHref: string
}> = props => {
  return (
    <a className={HelpIcon.name} target='_blank' href={props.notionHref}>
      <LiveHelpIcon />
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
