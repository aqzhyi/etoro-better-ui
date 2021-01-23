import React from 'react'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { useAppSelector } from '~/store/_store'
import { GM } from '~/GM'
import { ProfitText } from '~/components/ProfitText'
import { AppTrans } from '~/components/AppTrans'

const SidebarWithdrawalButton = () => {
  const selected = useAppSelector(state => state.settings.selectedExchange)
  const exchanges = {
    NTD: useAppSelector(state => state.settings.NTD),
    MYR: useAppSelector(state => state.settings.MYR),
  }

  if (!selected || selected === 'HIDDEN') {
    return null
  }

  return (
    <AppTrans
      i18nKey='link_withdrawExtra_text'
      values={{
        value: exchanges[selected].buy,
      }}
    ></AppTrans>
  )
}

const { container } = registerReactComponent({
  component: <SidebarWithdrawalButton />,
  containerId: 'SidebarWithdrawalExtraInfo',
  containerConstructor: containerElement => {
    $('[automation-id="menu-layout-withdrawal-icon"]')
      .parent()
      .append(containerElement)
      .css({
        'font-size': '14px',
        'text-shadow': '1px 1px 1px #303030',
      })
  },
})
