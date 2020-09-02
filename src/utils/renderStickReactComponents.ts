import '~/components/ExecutionDialog/applyExecutionDialogAutoScaling'
import '~/components/ExecutionDialog/ExecutionDialogControls'
import '~/components/ExecutionDialog/ExecutionDialogStatusInfo'
import '~/components/ExecutionDialog/ExecutionDialogTakeProfitStopLossControls'
import '~/components/Footer/constructContainersForFooterUnitValues'
import '~/components/Sidebar/SidebarMenuItems'
import '~/components/Sidebar/SidebarSettingsDialog'
import '~/components/Sidebar/SidebarWithdrawalExtraInfo'
import '~/components/Sidebar/SidebarWithdrawalExtraInfo'
import '~/components/Watchlist/WatchlistHeader'
import '~/components/Watchlist/WatchlistUsersControls'
import '~/components/Watchlist/WatchlistFindAndRegister'
import '~/components/UniversalControl/UniversalControlKeyObserver'
import '~/components/Sidebar/SidebarPendingOrdersLink'
import '~/components/Portfolio/ProtfolioInvestedCloseButton'
import '~/components/ExecutionDialog/ExecutionDialogPrices'
import '~/components/TradeDashboard'
import '~/components/Sidebar/SdiebarTradeDashboardLink'
import '~/components/Key12345Probe'
import '~/App'
import { registeredComponents } from '~/utils/registerReactComponent'

export const renderStickReactComponents = () => {
  for (const [id, utils] of registeredComponents) {
    utils.mount()
  }
}
