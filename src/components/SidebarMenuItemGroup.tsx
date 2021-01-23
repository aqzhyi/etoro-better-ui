/** @jsx jsx */ import { jsx, css } from '@emotion/react'
import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { AppTrans } from '~/components/AppTrans'
import { SidebarMenuItem } from '~/components/SidebarMenuItem'
import { SetupsDialog } from '~/components/SetupsDialog'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'
import { useAppTranslation } from '~/hooks/useAppTranslation'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React from 'react'
import packageJSON from '../../package.json'
import { KeyProbe } from '~/components/KeyProbe'

const sendEvent = (label: string) => {
  gaAPI.sendEvent(GaEventId.sidebar_extensionMenuItemClick, label)
}

export const SidebarMenuItemGroup = () => {
  const locale = useAppTranslation()
  const display = useAppSelector(state => state.display)
  const dispatch = useAppDispatch()

  /** Etoro 左側欄樣式為動態產生名稱，沒有此變量，則無法正確呈現 CSS 樣式 */
  const dynamicStyleClassName =
    Array.from($('.w-menu').get(0).attributes).find(value =>
      value.name.includes('_ngcontent'),
    )?.name || ''

  const attrsToAppend = { [dynamicStyleClassName]: '' }

  return (
    <span
      css={css`
        a {
          color: #d1d3e0;
        }
      `}
    >
      <div {...attrsToAppend} className='i-menu-sep'>
        <span>
          <AppTrans i18nKey='universal_extensionName_text'></AppTrans>
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
            dispatch(toggleSetupDialog(!display.setupDialog))
            sendEvent('button_settings_dialog')
          },
        }}
      >
        <AppTrans i18nKey='universal_setup_text'></AppTrans>
        <KeyProbe
          filter='S'
          command={() => {
            dispatch(toggleSetupDialog(!display.setupDialog))
            sendEvent('button_settings_dialog')
          }}
        ></KeyProbe>
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
        <AppTrans i18nKey='link_donation_text'></AppTrans>
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
        <AppTrans i18nKey='link_extensionWebsite_text'></AppTrans>
      </SidebarMenuItem>
      <SetupsDialog></SetupsDialog>
    </span>
  )
}

export const registeredSidebarMenuItems = registerReactComponent({
  component: <SidebarMenuItemGroup />,
  containerId: 'SidebarMenuItems',
  containerConstructor: container => {
    $('.w-menu-main').append(container)
  },
})
