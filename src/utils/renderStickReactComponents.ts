import '@/components/ExecutionDialog/applyExecutionDialogAutoScaling'
import '@/components/ExecutionDialog/ExecutionDialogControls'
import '@/components/ExecutionDialog/ExecutionDialogStatusInfo'
import '@/components/ExecutionDialog/ExecutionDialogStopLossControls'
import '@/components/ExecutionDialog/ExecutionDialogTakeProfitControls'
import '@/components/Footer/constructContainersForFooterUnitValues'
import '@/components/Portfolio/PortfolioHeaderExtraButtons'
import '@/components/Portfolio/PortfolioHistoryHeaderExtraButtons'
import '@/components/Sidebar/SidebarMenuItems'
import '@/components/Sidebar/SidebarSettingsDialog'
import '@/components/Sidebar/SidebarWithdrawalExtraInfo'
import '@/components/Sidebar/SidebarWithdrawalExtraInfo'
import '@/components/Watchlist/WatchlistHeader'
import '@/components/Watchlist/WatchlistUsersControls'
import '@/components/Watchlist/WatchlistFindAndRegister'
import '@/components/UniversalControl/UniversalControlKeyObserver'
import '@/components/Sidebar/SidebarPendingOrdersLink'
import { registeredComponents } from '@/utils/registerReactComponent'

export const renderStickReactComponents = () => {
  for (const [id, utils] of registeredComponents) {
    utils.mount()
  }
}
