import { PrimaryTrans } from '@/components/PrimaryTrans'
import { SidebarMenuItem } from '@/components/Sidebar/SidebarMenuItem'
import { gaAPI, GaEventId } from '@/gaAPI'
import { useAppPendingOrder } from '@/hooks/useAppPendingOrder'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React, { useEffect, useMemo } from 'react'

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
      <PrimaryTrans
        i18nKey='link_pendingOrders_text'
        values={{
          value: pendingOrders.value.length,
        }}
      ></PrimaryTrans>
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
