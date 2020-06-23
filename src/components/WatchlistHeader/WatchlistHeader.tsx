import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store, { useAppSelector, useAppDispatch } from '@/store/_store'
import { i18n } from '@/i18n'
import { GM } from '@/GM'
import { Tooltip } from '@blueprintjs/core'
import { storage } from '@/storage'
import { setListCompact } from '@/actions/setListCompact'
import { useMount } from 'react-use'
import { Toggle, TextField, Stack, TextFieldBase } from '@fluentui/react'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

const NAME_HAS_FLAG = 'etoro-better-ui-WatchlistHeader-is-ready'

const showMeBy = (filterText = '') => {
  if (filterText) {
    $('et-user-row, et-user-card, et-instrument-row, et-instrument-card').hide()

    $(
      '[automation-id=trade-item-name], [automation-id="trade-item-full-name"]',
    ).each((index, element) => {
      const didMatch = element.innerText
        .trim()
        .toUpperCase()
        .includes(filterText.trim().toUpperCase())

      if (didMatch) {
        $(element)
          .closest(
            'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
          )
          .show()
      }
    })
  } else {
    $('et-user-row, et-user-card, et-instrument-row, et-instrument-card').show()
  }
}

const toggleListInvested = (onOff: boolean) => {
  if (onOff) {
    $('et-instrument-row, et-user-row').hide()
    $('.instrument-list-pie-link')
      .closest('et-instrument-row, et-user-row')
      .show()
  } else {
    $('et-instrument-row, et-user-row').show()
  }
}

const toggleListCompact = (onOff: boolean) => {
  $(
    `
    [automation-id="watchlist-item-list-instrument-chart"],
    [automation-id="watchlist-item-list-instrument-sentiment"],
    et-fifty-two-weeks,
    [automation-id="watchlist-item-list-user-wrapp-investors"]
    `,
  ).toggle(!onOff)
}

export const WatchlistHeader: React.FC = () => {
  const listCompactOn = useAppSelector(
    state => state.settings.betterEtoroUIConfig.listCompactOn,
  )
  const shouldShowInvested = useAppSelector(
    state => state.settings.betterEtoroUIConfig.showInvested,
  )
  const dispatch = useAppDispatch()
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  useMount(() => {
    toggleListCompact(listCompactOn)
    toggleListInvested(shouldShowInvested)
  })

  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} className={NAME_HAS_FLAG}>
      <Stack.Item>
        <Tooltip position='left' content={i18n.回車鍵使彈出下單框()}>
          <TextField
            componentRef={searchBoxRef}
            placeholder={i18n.輸入以過濾()}
            iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
            onChange={(event, newValue) => {
              filterTextSet(newValue)
              showMeBy(newValue)

              if (!newValue) {
                toggleListInvested(shouldShowInvested)
              }
            }}
            onMouseEnter={() => {
              // setTimeout 避免 polyfills-es5 報錯 Cannot assign to read only property 'event' of object '[object Object]'
              globalThis.setTimeout(() => {
                searchBoxRef.current?.focus()
              })
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'enter') {
                $('[automation-id="buy-sell-button-container-buy"]:visible')
                  .eq(0)
                  .click()
              }
            }}
          />
        </Tooltip>
      </Stack.Item>

      <Stack.Item>
        <Toggle
          label={i18n.使緊湊()}
          inlineLabel
          checked={listCompactOn}
          onClick={() => {
            storage.saveConfig({ listCompactOn: !listCompactOn })
            toggleListCompact(!listCompactOn)
            dispatch(setListCompact(!listCompactOn))
          }}
        />
      </Stack.Item>

      <Stack.Item>
        <Toggle
          label={i18n.使已投資顯示()}
          inlineLabel
          checked={shouldShowInvested}
          onClick={() => {
            toggleListInvested(!shouldShowInvested)
            dispatch(
              setBetterEtoroUIConfig({ showInvested: !shouldShowInvested }),
            )
          }}
        />
      </Stack.Item>
    </Stack>
  )
}

export const watchlistHeaderHasReady = () => !!$(`.${NAME_HAS_FLAG}`).length

export const watchlistHeaderConstructor = () => {
  if (watchlistHeaderHasReady()) {
    return
  }

  const headerWrap = $('.watchlist-header')
  const buttonWarp = headerWrap.find('.watch-list-buttons')

  if (buttonWarp.length && !$(`#${watchlistHeaderConstructor.name}`).length) {
    buttonWarp.prepend(`<span id='${watchlistHeaderConstructor.name}'></span>`)
  }

  globalThis.document.querySelector(`#${watchlistHeaderConstructor.name}`) &&
    ReactDOM.render(
      <Provider store={store}>
        <WatchlistHeader></WatchlistHeader>
      </Provider>,
      globalThis.document.querySelector(`#${watchlistHeaderConstructor.name}`),
    )
}

GM.addStyle(`
  #${watchlistHeaderConstructor.name} {
    margin-top: 18px;
  }
`)
