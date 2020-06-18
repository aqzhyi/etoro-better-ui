import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '@/store/_store'
import { i18n } from '@/i18n'
import { GM } from '@/GM'
import { InputGroup, Button, ControlGroup } from '@blueprintjs/core'
import { storage } from '@/storage'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setListCompact } from '@/actions/setListCompact'
import { useMount } from 'react-use'

const NAME_HAS_FLAG = 'etoro-better-ui-WatchlistHeader-is-ready'

const showMeBy = (filterText: string) => {
  $('[automation-id=trade-item-name]').each((index, element) => {
    if (!filterText) {
      $(element)
        .closest(
          'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
        )
        .show()
      return
    }

    if (element.innerText.toUpperCase().includes(filterText.toUpperCase())) {
      $(element)
        .closest(
          'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
        )
        .show()
    } else {
      $(element)
        .closest(
          'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
        )
        .hide()
    }
  })
}

const toggleListCompact = (onOff: boolean) => {
  $(
    '[automation-id="watchlist-item-list-instrument-chart"], [automation-id="watchlist-item-list-instrument-sentiment"]',
  ).toggle(!onOff)
}

export const WatchlistHeader: React.FC = () => {
  const listCompactOn = useAppSelector(
    state => state.settings.betterEtoroUIConfig.listCompactOn,
  )
  const dispatch = useAppDispatch()

  useMount(() => {
    toggleListCompact(listCompactOn)
  })

  return (
    <ControlGroup className={NAME_HAS_FLAG}>
      <InputGroup
        leftIcon='filter'
        onChange={event => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          showMeBy(event.target.value)
        }}
        onMouseEnter={event => {
          ;(event.target as HTMLInputElement)?.focus()
        }}
        placeholder={i18n.輸入以過濾()}
      />
      <Button
        icon={(listCompactOn && 'small-tick') || 'small-cross'}
        onClick={() => {
          storage.saveConfig({ listCompactOn: !listCompactOn })
          toggleListCompact(!listCompactOn)
          dispatch(setListCompact(!listCompactOn))
        }}
      >
        {i18n.使緊湊()}
      </Button>
    </ControlGroup>
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
    margin-top: 20px;
  }
`)
