import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import { i18n } from '@/i18n'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { RiskSpecification } from '@/components/RiskSpecification'
import { registerReactComponent } from '@/utils/registerReactComponent'
import packageJSON from '../../../package.json'
import { GM } from '@/GM'
import { gaAPI, GaEventId } from '@/gaAPI'

const sendEvent = (label: string) => {
  gaAPI.sendEvent(GaEventId.sidebar_extensionMenuItemClick, label)
}

export const SidebarMenuItems = () => {
  const display = useAppSelector(state => state.display)
  const dispatch = useAppDispatch()

  /**
   * etoro 左側欄樣式為動態產生名稱，沒有此變量，則無法正確呈現 CSS 樣式
   */
  const dynamicStyleClassName =
    Array.from($('.w-menu').get(0).attributes).find(value =>
      value.name.includes('_ngcontent'),
    )?.name || ''

  const attrsToAppend = { [dynamicStyleClassName]: '' }

  return (
    <span>
      <div {...attrsToAppend} className='i-menu-sep'>
        <span>{i18n.腳本標題()}</span>
        <a
          href='https://github.com/hilezir/etoro-better-ui/releases'
          target='_blank'
        >
          {packageJSON.version}
        </a>
      </div>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        onClick={() => {
          dispatch(toggleSettingsDialog(!display.betterEtoroUISettingsDialog))
          sendEvent('button_settings_dialog')
        }}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite settings'></span>
        {i18n.設定()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/Donate-Me-ab484fc786bf44f8b19a017fdbe4a698'
        onClick={sendEvent.bind(sendEvent, 'link_donate')}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite funds'></span>
        {i18n.幫助作者()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        onClick={sendEvent.bind(sendEvent, 'link_website')}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite news'></span>
        {i18n.腳本官網()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2'
        onClick={sendEvent.bind(sendEvent, 'link_contact')}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite help'></span>
        {i18n.聯絡作者()}
      </a>

      <RiskSpecification aClassName={'i-menu-link'} attrs={attrsToAppend}>
        <span {...attrsToAppend} className={'i-menu-icon sprite help'}></span>
      </RiskSpecification>

      <SidebarSettingsDialog></SidebarSettingsDialog>
    </span>
  )
}

export const registeredSidebarMenuItems = registerReactComponent({
  component: <SidebarMenuItems />,
  containerId: 'SidebarMenuItems',
  containerConstructor: container => {
    $('.w-menu-main').append(container)
  },
})

GM.addStyle(`
  #${registeredSidebarMenuItems.container.id} a {
    color: #d1d3e0;
  }
`)
