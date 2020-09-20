import '~/components/ExecutionDialog/applyExecutionDialogAutoScaling'
import '~/components/ExecutionDialog/ExecutionDialogControls'
import '~/components/ExecutionDialog/ExecutionDialogStatusInfo'
import '~/components/Footer/constructContainersForFooterUnitValues'
import '~/components/SidebarMenuItemGroup'
import '~/components/SetupsDialog'
import '~/components/SidebarWithdrawalButton'
import '~/components/SidebarWithdrawalButton'
import '~/components/Watchlist/WatchlistHeader'
import '~/components/Watchlist/WatchlistUsersControls'
import '~/components/Watchlist/WatchlistFindAndRegister'
import '~/components/UniversalControlKeyObserver'
import '~/components/SidebarPendingOrdersLink'
import '~/components/InstrumentProtfolioBiggerCloseButton'
import '~/components/ExecutionDialog/ExecutionDialogPrices'
import '~/components/TradeDashboard'
import '~/components/SidebarTradeDashboardLink'
import '~/components/Key12345Probe'
import '~/App'
import { registeredComponents } from '~/utils/registerReactComponent'

export const renderStickReactComponents = () => {
  for (const [id, utils] of registeredComponents) {
    utils.mount()
  }
}
