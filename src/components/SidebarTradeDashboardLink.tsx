import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { Kbd } from '~/components/Kbd'
import { AppTrans } from '~/components/AppTrans'
import { SidebarMenuItem } from '~/components/SidebarMenuItem'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React from 'react'
import { KeyProbe } from '~/components/KeyProbe'
import { useDispatchTradeDashboardOpen } from '~/hooks/useDispatchTradeDashboardOpen'

export const SidebarTradeDashboardLink: React.FC = props => {
  const dispatch = useAppDispatch()
  const tradeDashboardOpen = useAppSelector(
    state => state.display.tradeDashboard,
  )
  const tradeDashboard = useDispatchTradeDashboardOpen()

  return (
    <React.Fragment>
      <SidebarMenuItem
        iconName='clubs-ref'
        aProps={{
          className: (tradeDashboardOpen && 'active') || '',
          onClick: () => {
            tradeDashboard.toggle()
          },
        }}
      >
        <AppTrans i18nKey='link_dashboard_text'></AppTrans>
        <KeyProbe
          filter='D'
          command={() => {
            tradeDashboard.open()
          }}
        ></KeyProbe>
      </SidebarMenuItem>
    </React.Fragment>
  )
}
