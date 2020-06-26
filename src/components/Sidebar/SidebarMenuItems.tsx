import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import { i18n } from '@/i18n'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store, { useAppSelector, useAppDispatch } from '@/store/_store'
import { RiskSpecification } from '@/components/RiskSpecification'
import { stickReactComponent } from '@/utils/stickReactComponent'

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
        href='https://www.notion.so/hilezi/Donate-Me-ab484fc786bf44f8b19a017fdbe4a698'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite funds'></span>
        {i18n.幫助作者()}
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

      <RiskSpecification aClassName={'i-menu-link'} attrs={attrsToAppend}>
        <span {...attrsToAppend} className={'i-menu-icon sprite help'}></span>
      </RiskSpecification>

      <SidebarSettingsDialog></SidebarSettingsDialog>
    </span>
  )
}

export const {
  mount: mountSidebarMenuItems,
  unmount: unmountSidebarMenuItems,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <SidebarMenuItems />
    </Provider>
  ),
  containerId: 'SidebarMenuItems',
  containerConstructor: container => {
    $('.w-menu-main').append(container)
  },
})