import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { setMacroEnabled } from '@/actions/setMacroEnabled'
import HelperContent from '@/components/HelperContent'
import { emitter, Events } from '@/emitter'
import { exchange, getMYR, getNTD } from '@/exchange'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { i18n } from '@/i18n'
import { storage } from '@/storage'
import { Dialog } from '@blueprintjs/core'
import { ChoiceGroup, Stack, TextField, TextFieldBase } from '@fluentui/react'
import toast from 'cogo-toast'
import * as React from 'react'
import { useInterval } from 'react-use'
import { SidebarSettingsDialog } from '@/components/Sidebar/SidebarSettingsDialog'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'

const READY_FLAG = 'etoro-better-ui-sidebar-is-ready'

export const sidebarCheckReady = () => !!$(`.${READY_FLAG}`).length

const Sidebar: React.FunctionComponent = () => {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const [ping, setPing] = React.useState(0)
  const [settingDialogOpen, settingDialogOpenSet] = React.useState(false)
  const macroAmountInputRef = React.createRef<TextFieldBase>()

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

export default Sidebar
