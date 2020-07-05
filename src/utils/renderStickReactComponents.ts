import { mountableStickyComponents } from '@/utils/stickReactComponent'
import '@/components/ExecutionDialog/applyExecutionDialogAutoScaling'
import '@/components/Sidebar/SidebarWithdrawalExtraInfo'
import '@/components/ExecutionDialog/ExecutionDialogTakeProfitControls'
import '@/components/ExecutionDialog/ExecutionDialogStopLossControls'

export const renderStickReactComponents = () => {
  for (const [, mount] of mountableStickyComponents) {
    mount()
  }
}
