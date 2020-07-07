import React from 'react'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { useAppSelector } from '@/store/_store'
import { i18n } from '@/i18n'
import { GM } from '@/GM'

const SidebarWithdrawalExtraInfo = () => {
  const selected = useAppSelector(
    state => state.settings.betterEtoroUIConfig.selectedExchange,
  )
  const exchanges = {
    NTD: useAppSelector(state => state.settings.betterEtoroUIConfig.NTD),
    MYR: useAppSelector(state => state.settings.betterEtoroUIConfig.MYR),
  }

  if (!selected || selected === 'HIDDEN') {
    return null
  }

  return <span>{i18n.左側欄出金按鈕(exchanges[selected].buy)}</span>
}

const { container } = registerReactComponent({
  component: <SidebarWithdrawalExtraInfo />,
  containerId: 'SidebarWithdrawalExtraInfo',
  containerConstructor: containerElement => {
    $('[automation-id="menu-layout-withdrawal-icon"]')
      .parent()
      .append(containerElement)
  },
})

GM.addStyle(`
  #${container.id} {
    font-size: 10px;
    1px 1px 1px #303030
  }
`)
