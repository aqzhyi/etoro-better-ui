import React, { AnchorHTMLAttributes } from 'react'
import { sidebarDynamicNgContent } from '~/utils/sidebarDynamicNgContent'

export const SidebarMenuItem: React.FC<{
  iconName:
    | 'watch'
    | 'protfolio'
    | 'news'
    | 'markets'
    | 'people'
    | 'funds'
    | 'clubs-ref'
    | 'people-ref'
    | 'help'
    | 'learn-more'
    | 'withdrawal'
    | 'settings'
    | 'logout'
    | 'funds'
  aProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}> = props => {
  return (
    <a
      {...{ [sidebarDynamicNgContent]: '' }}
      {...props.aProps}
      className={`i-menu-link pointer ${props.aProps?.className || ''}`}
    >
      <span
        {...{ [sidebarDynamicNgContent]: '' }}
        className={`i-menu-icon sprite ${props.iconName}`}
      ></span>
      {props.children}
    </a>
  )
}
