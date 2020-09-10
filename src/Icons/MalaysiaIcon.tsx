import { SvgIcon, SvgIconProps } from '@material-ui/core'
import React from 'react'
import MalaysiaSvg from './malaysia.svg'

export const MalaysiaIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox='0 0 512 512' component={MalaysiaSvg}></SvgIcon>
  )
}
