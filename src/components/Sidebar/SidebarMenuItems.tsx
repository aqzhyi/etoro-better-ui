import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import { i18n } from '@/i18n'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import packageJSON from '../../../package.json'
import { GM } from '@/GM'
import { gaAPI, GaEventId } from '@/gaAPI'
import { SidebarMenuItem } from '@/components/Sidebar/SidebarMenuItem'

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
        <span>{i18n.universal_extensionName_text()}</span>
        <a
          href='https://github.com/hilezir/etoro-better-ui/releases'
          target='_blank'
        >
          {packageJSON.version}
        </a>
      </div>

      <SidebarMenuItem
        iconName='settings'
        aProps={{
          onClick: () => {
            dispatch(toggleSettingsDialog(!display.betterEtoroUISettingsDialog))
            sendEvent('button_settings_dialog')
          },
        }}
      >
        {i18n.universal_setup_text()}
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='funds'
        aProps={{
          target: '_blank',
          href:
            'https://www.notion.so/hilezi/Donate-Me-ab484fc786bf44f8b19a017fdbe4a698',
          onClick: sendEvent.bind(sendEvent, 'link_donate'),
        }}
      >
        {i18n.link_donation_text()}
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='news'
        aProps={{
          target: '_blank',
          href: 'https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3',
          onClick: sendEvent.bind(sendEvent, 'link_website'),
        }}
      >
        {i18n.link_extensionWebsite_text()}
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='help'
        aProps={{
          target: '_blank',
          href: 'https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2',
          onClick: sendEvent.bind(sendEvent, 'link_contact'),
        }}
      >
        {i18n.link_extensionAuthor_text()}
      </SidebarMenuItem>

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
