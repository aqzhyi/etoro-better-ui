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

const READY_FLAG = 'etoro-better-ui-sidebar-is-ready'

export const sidebarCheckReady = () => !!$(`.${READY_FLAG}`).length

const Sidebar: React.FunctionComponent = () => {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const [ping, setPing] = React.useState(0)
  const [settingDialogOpen, settingDialogOpenSet] = React.useState(false)
  const macroAmountInputRef = React.createRef<TextFieldBase>()

  useInterval(() => {
    const start = new Date().getTime()

    fetch('https://www.etoro.com/discover/copyportfolios').finally(() => {
      const end = new Date().getTime()
      setPing(end - start)
    })
  }, 10000)

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
          settingDialogOpenSet(value => !value)
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

      <span {...attrsToAppend} className='i-menu-link'>
        <span
          {...attrsToAppend}
          className='i-menu-icon sprite clubs-ref'
        ></span>
        {i18n.大概延遲(ping)}
      </span>

      <Dialog
        title={i18n.腳本標題()}
        canEscapeKeyClose={true}
        canOutsideClickClose={false}
        onClose={() => {
          settingDialogOpenSet(value => !value)
        }}
        isOpen={settingDialogOpen}
      >
        <Stack tokens={{ padding: 16, childrenGap: 32 }}>
          <Stack.Item>
            <TextField
              componentRef={macroAmountInputRef}
              label={i18n.下單巨集金額設定()}
              defaultValue={settings.betterEtoroUIConfig.executionAmount.join(
                ',',
              )}
              onKeyDown={event => {
                if (event.key.toLowerCase() === 'enter') {
                  const value = macroAmountInputRef.current?.value || '200'
                  dispatch(setMacroAmount(value.split(',').map(Number)))
                }
              }}
            ></TextField>
          </Stack.Item>

          <Stack.Item>
            <ChoiceGroup
              label={i18n.下單巨集啟用狀態(settings.isMacroEnabled)}
              defaultSelectedKey={settings.isMacroEnabled ? 'ON' : 'OFF'}
              options={[
                {
                  key: 'ON',
                  text: 'ON',
                  iconProps: { iconName: 'ActivateOrders' },
                },
                {
                  key: 'OFF',
                  text: 'OFF',
                  iconProps: { iconName: 'DeactivateOrders' },
                },
              ]}
              onChange={(event, option) => {
                const yourEnabled = option?.key === 'ON' ? true : false

                dispatch(setMacroEnabled(yourEnabled))

                storage.saveConfig({ executionMacroEnabled: yourEnabled })

                emitter.emit(Events.settingChange)

                toast.success(
                  i18n.設定已變更(() => (
                    <span>{JSON.stringify(yourEnabled)}</span>
                  )),
                  { position: 'bottom-left' },
                )
              }}
            ></ChoiceGroup>
          </Stack.Item>

          <Stack.Item>
            <ChoiceGroup
              label={i18n.設定幣別(settings.exchange.selected)}
              defaultSelectedKey={settings.exchange.selected}
              options={[
                {
                  key: 'NTD',
                  text: 'NTD',
                  iconProps: { iconName: 'AllCurrency' },
                },
                {
                  key: 'MYR',
                  text: 'MYR',
                  iconProps: { iconName: 'AllCurrency' },
                },
              ]}
              onChange={async (event, option) => {
                const loading = toast.loading(i18n.設定變更中(), {
                  position: 'bottom-left',
                })

                const youSelected = (option?.key ||
                  'NTD') as typeof exchange['selected']

                if (youSelected === 'NTD') {
                  exchange.NTD = await getNTD()
                }

                if (youSelected === 'MYR') {
                  exchange.MYR = await getMYR()
                }

                dispatch(setExchangeSelected(youSelected))

                storage.saveConfig({ selectedExchange: youSelected })

                emitter.emit(Events.settingChange)

                toast.success(
                  i18n.設定已變更(() => <span>{youSelected}</span>),
                  { position: 'bottom-left' },
                )

                loading.hide?.()
              }}
            />
          </Stack.Item>
        </Stack>
      </Dialog>
    </span>
  )
}

export default Sidebar
