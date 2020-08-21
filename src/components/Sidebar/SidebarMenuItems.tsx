import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import packageJSON from '../../../package.json'
import { GM } from '@/GM'
import { gaAPI, GaEventId } from '@/gaAPI'
import { SidebarMenuItem } from '@/components/Sidebar/SidebarMenuItem'
import { useTranslation } from 'react-i18next'
import { PrimaryTrans } from '@/components/PrimaryTrans'

const sendEvent = (label: string) => {
  gaAPI.sendEvent(GaEventId.sidebar_extensionMenuItemClick, label)
}

export const SidebarMenuItems = () => {
  const locale = useTranslation()
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
        <span>
          <PrimaryTrans i18nKey='universal_extensionName_text'></PrimaryTrans>
        </span>
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
        <PrimaryTrans i18nKey='universal_setup_text'></PrimaryTrans>
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
        <PrimaryTrans i18nKey='link_donation_text'></PrimaryTrans>
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='people-ref'
        aProps={{
          target: '_blank',
          href: 'https://t.me/etoro_better_ui',
          onClick: () => {
            sendEvent('link_telegram_chatroom')
          },
        }}
      >
        Telegram
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='news'
        aProps={{
          target: '_blank',
          href: 'https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3',
          onClick: sendEvent.bind(sendEvent, 'link_website'),
        }}
      >
        <PrimaryTrans i18nKey='link_extensionWebsite_text'></PrimaryTrans>
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
