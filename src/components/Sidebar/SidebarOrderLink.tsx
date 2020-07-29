import React, { useEffect, useMemo } from 'react'
import { SidebarMenuItem } from '@/components/Sidebar/SidebarMenuItem'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { i18n } from '@/i18n'
import { angularAPI } from '@/angularAPI'
import { TooltipHighlightText } from '@/components/TooltipHighlightText'

export const SidebarOrderLink: React.FC = props => {
  const isActive = useMemo(() => {
    return globalThis.location.pathname.includes('portfolio/orders')
      ? 'active'
      : ''
  }, [globalThis.location.pathname])

  useEffect(() => {
    if (isActive) {
      $('.i-menu-link.active').eq(0).removeClass('active')
    }
  }, [isActive])

  const orders = useMemo(() => {
    return angularAPI.$rootScope.session.user.portfolio.orders
  }, [...angularAPI.$rootScope.session.user.portfolio.orders])

  return (
    <SidebarMenuItem
      iconName='learn-more'
      aProps={{
        href: '/portfolio/orders',
        className: isActive,
      }}
    >
      {i18n.左側欄我的掛單()}（
      <TooltipHighlightText>{orders.length}</TooltipHighlightText>）
    </SidebarMenuItem>
  )
}

registerReactComponent({
  component: <SidebarOrderLink />,
  containerId: SidebarOrderLink.name,
  containerConstructor: reactContainer => {
    $(reactContainer).insertBefore($('.i-menu-link[href^="/feed"]'))
  },
})
