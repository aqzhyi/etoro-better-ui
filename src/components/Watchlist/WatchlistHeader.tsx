import { angularAPI } from '@/angularAPI'
import { WatchlistCompactSwitch } from '@/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '@/components/Watchlist/WatchlistInvestedSwitch'
import { GM } from '@/GM'
import { useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { DefaultButton, Stack, TextField, TextFieldBase } from '@fluentui/react'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useMount, useDebounce } from 'react-use'
import { gaAPI, GaEventId } from '@/gaAPI'
import { useTranslation } from 'react-i18next'
import { PrimaryTrans } from '@/components/PrimaryTrans'

export const WatchlistHeader: React.FC = () => {
  const locale = useTranslation()
  const listCompactOn = useAppSelector(state => state.settings.listCompactOn)
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  useMount(() => {
    angularAPI.toggleListCompact(listCompactOn)
    angularAPI.toggleListInvested(shouldShowInvested)
  })

  useDebounce(
    () => {
      if (filterText) {
        gaAPI.sendEvent(GaEventId.watchlists_filterByText)
      }
    },
    1000,
    [filterText],
  )

  return (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <Stack.Item>
        <DefaultButton
          text={locale.t('filterText_clearText_text')}
          onClick={() => {
            filterTextSet('')
            angularAPI.filterWatchlistByText('')
            angularAPI.toggleListInvested(shouldShowInvested)
            gaAPI.sendEvent(GaEventId.watchlists_filterByTextClearClick)
          }}
          allowDisabledFocus
        />
      </Stack.Item>

      <Stack.Item>
        <Tooltip
          placement='bottom'
          overlay={
            <PrimaryTrans i18nKey='filterText_input_brief'></PrimaryTrans>
          }
        >
          <TextField
            value={filterText}
            componentRef={searchBoxRef}
            placeholder={locale.t('filterText_input_help')}
            iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
            onChange={(event, newValue) => {
              filterTextSet(newValue)
              angularAPI.filterWatchlistByText(newValue)

              if (!newValue) {
                angularAPI.toggleListInvested(shouldShowInvested)
              }
            }}
            onMouseEnter={() => {
              // setTimeout 避免 polyfills-es5 報錯 Cannot assign to read only property 'event' of object '[object Object]'
              globalThis.setTimeout(() => {
                searchBoxRef.current?.focus()
              })
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'escape') {
                gaAPI.sendEvent(GaEventId.watchlists_filterByTextEscapeKeyClick)
                filterTextSet('')
                angularAPI.filterWatchlistByText('')
                angularAPI.toggleListInvested(shouldShowInvested)
              }

              if (event.key.toLowerCase() === 'enter') {
                gaAPI.sendEvent(GaEventId.watchlists_filterByTextEnterKeyClick)
                $('[automation-id="buy-sell-button-container-buy"]:visible')
                  .eq(0)
                  .click()

                searchBoxRef.current?.blur()
              }
            }}
          />
        </Tooltip>
      </Stack.Item>

      <Stack.Item>
        <Tooltip
          placement='bottom'
          overlay={
            <PrimaryTrans i18nKey='universal_compact_brief'></PrimaryTrans>
          }
        >
          <div>
            <WatchlistCompactSwitch />
          </div>
        </Tooltip>
      </Stack.Item>

      <Stack.Item>
        <Tooltip
          placement='bottom'
          overlay={
            <PrimaryTrans i18nKey='profits_invested_brief'></PrimaryTrans>
          }
        >
          <div>
            <WatchlistInvestedSwitch />
          </div>
        </Tooltip>
      </Stack.Item>
    </Stack>
  )
}

export const registeredWatchlistHeader = registerReactComponent({
  component: <WatchlistHeader></WatchlistHeader>,
  containerId: WatchlistHeader.name,
  containerConstructor: containerElement => {
    $('.watchlist-header .watch-list-buttons').prepend(containerElement)
  },
})

GM.addStyle(`
  #${registeredWatchlistHeader.container.id} {
    margin-top: 18px;
  }

  #${registeredWatchlistHeader.container.id} .ms-Toggle .ms-Label {
    margin-left: 4px;
  }
`)
