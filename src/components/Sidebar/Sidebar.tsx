import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import HelperContent from '@/components/HelperContent'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import { i18n } from '@/i18n'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store, { useAppSelector, useAppDispatch } from '@/store/_store'

const READY_FLAG = 'etoro-better-ui-sidebar-is-ready'

export const SidebarMenuItems = () => {
  const settings = useAppSelector(state => state.settings)
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
    <span className={READY_FLAG}>
      <div {...attrsToAppend} className='i-menu-sep'>
        {i18n.腳本標題()}
      </div>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        onClick={() => {
          dispatch(toggleSettingsDialog(!settings.betterEtoroUISettingsDialog))
        }}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite settings'></span>
        {i18n.設定()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite news'></span>
        {i18n.腳本官網()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite help'></span>
        {i18n.聯絡作者()}
      </a>

      <HelperContent.RiskSpecification
        aClassName={'i-menu-link'}
        attrs={attrsToAppend}
      >
        <span {...attrsToAppend} className={'i-menu-icon sprite help'}></span>
      </HelperContent.RiskSpecification>

      <SidebarSettingsDialog></SidebarSettingsDialog>
    </span>
  )
}

SidebarMenuItems.hasRendered = () => !!$(`.${READY_FLAG}`).length

SidebarMenuItems.render = function renderSidebarMenuItems() {
  if (SidebarMenuItems.hasRendered()) {
    return
  }

  if (!$('#sidebarConstructor').length) {
    $('.w-menu-main').append('<span id="sidebarConstructor"><span>')
  }

  globalThis.document.querySelector('#sidebarConstructor') &&
    ReactDOM.render(
      <Provider store={store}>
        <SidebarMenuItems />
      </Provider>,
      globalThis.document.querySelector('#sidebarConstructor'),
    )
}
