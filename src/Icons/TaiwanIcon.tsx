import { SvgIcon, SvgIconProps } from '@material-ui/core'
import React from 'react'
import TaiwanSvg from './taiwan.svg'

export const TaiwanIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox='0 0 512 512' component={TaiwanSvg}></SvgIcon>
  )
}
