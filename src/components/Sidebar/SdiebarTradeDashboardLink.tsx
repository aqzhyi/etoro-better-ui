import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { Kbd } from '~/components/Kbd'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { SidebarMenuItem } from '~/components/Sidebar/SidebarMenuItem'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React from 'react'
import { KeyProbe } from '~/components/KeyProbe'

export const SdiebarTradeDashboardLink: React.FC = props => {
  const dispatch = useAppDispatch()
  const isActive = useAppSelector(state => state.settings.showTradeDashboard)

  return (
    <React.Fragment>
      <SidebarMenuItem
        iconName='clubs-ref'
        aProps={{
          className: (isActive && 'active') || '',
          onClick: () => {
            gaAPI.sendEvent(GaEventId.sidebar_dashboardLinkClick)
            dispatch(
              setBetterEtoroUIConfig({
                showTradeDashboard: !isActive,
              }),
            )
          },
        }}
      >
        <PrimaryTrans i18nKey='link_dashboard_text'></PrimaryTrans>
        <KeyProbe
          filter='D'
          command={() => {
            gaAPI.sendEvent(GaEventId.sidebar_dashboardLinkClick)
            dispatch(
              setBetterEtoroUIConfig({
                showTradeDashboard: true,
              }),
            )
          }}
        ></KeyProbe>
      </SidebarMenuItem>
    </React.Fragment>
  )
}

registerReactComponent({
  component: <SdiebarTradeDashboardLink></SdiebarTradeDashboardLink>,
  containerId: SdiebarTradeDashboardLink.name,
  containerConstructor: container => {
    $(container).insertBefore($('.i-menu-link[href^="/watchlists"]'))
  },
})
