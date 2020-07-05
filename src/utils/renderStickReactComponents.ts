import { mountableStickyComponents } from '@/utils/stickReactComponent'
import '@/components/ExecutionDialog/applyExecutionDialogAutoScaling'
import '@/components/Sidebar/SidebarWithdrawalExtraInfo'

export const renderStickReactComponents = () => {
  for (const [, mount] of mountableStickyComponents) {
    mount()
  }
}
