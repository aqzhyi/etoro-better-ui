import { angularAPI } from '@/angularAPI'
import { SidebarMenuItem } from '@/components/Sidebar/SidebarMenuItem'
import { TooltipHighlightText } from '@/components/TooltipHighlightText'
import { gaAPI, GaEventId } from '@/gaAPI'
import { useAppPendingOrder } from '@/hooks/useAppPendingOrder'
import { i18n } from '@/i18n'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React, { useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'

export const SidebarPendingOrdersLink: React.FC = props => {
  const pendingOrders = useAppPendingOrder()

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

  return (
    <SidebarMenuItem
      iconName='learn-more'
      aProps={{
        href: '/portfolio/orders',
        className: isActive,
        onClick: () => {
          gaAPI.sendEvent(GaEventId.sidebar_pendingOrdersLinkClick)
        },
      }}
    >
      {i18n.link_pendingOrders_text()}（
      <TooltipHighlightText>{pendingOrders.value.length}</TooltipHighlightText>
      ）
    </SidebarMenuItem>
  )
}

registerReactComponent({
  component: <SidebarPendingOrdersLink />,
  containerId: SidebarPendingOrdersLink.name,
  containerConstructor: reactContainer => {
    $(reactContainer).insertBefore($('.i-menu-link[href^="/feed"]'))
  },
})
