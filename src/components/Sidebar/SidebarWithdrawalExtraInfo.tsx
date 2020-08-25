import React from 'react'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { useAppSelector } from '~/store/_store'
import { GM } from '~/GM'
import { ProfitText } from '~/components/ProfitText'
import { PrimaryTrans } from '~/components/PrimaryTrans'

const SidebarWithdrawalExtraInfo = () => {
  const selected = useAppSelector(state => state.settings.selectedExchange)
  const exchanges = {
    NTD: useAppSelector(state => state.settings.NTD),
    MYR: useAppSelector(state => state.settings.MYR),
  }

  if (!selected || selected === 'HIDDEN') {
    return null
  }

  return (
    <PrimaryTrans
      i18nKey='link_withdrawExtra_text'
      values={{
        value: exchanges[selected].buy,
      }}
    ></PrimaryTrans>
  )
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
    font-size: 14px;
    text-shadow: 1px 1px 1px #303030;
  }
`)
