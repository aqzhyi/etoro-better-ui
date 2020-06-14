import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '@/store/_store'
import { i18n } from '@/i18n'
import { GM } from '@/GM'
import { InputGroup } from '@blueprintjs/core'

const NAME_HAS_FLAG = 'etoro-better-ui-WatchlistHeader-is-ready'

const showMeBy = (filterText: string) => {
  $('[automation-id=trade-item-name]').each((index, element) => {
    if (!filterText) {
      $(element).closest('et-user-row, et-instrument-row').show()
      return
    }

    if (element.innerText.toUpperCase().includes(filterText.toUpperCase())) {
      $(element).closest('et-user-row, et-instrument-row').show()
    } else {
      $(element).closest('et-user-row, et-instrument-row').hide()
    }
  })
}

export const WatchlistHeader: React.FC = () => {
  return (
    <span className={NAME_HAS_FLAG}>
      <InputGroup
        leftIcon='filter'
        onChange={event => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          showMeBy(event.target.value)
        }}
        placeholder={i18n.輸入以過濾()}
      />
    </span>
  )
}

export const watchlistHeaderHasReady = () => !!$(`.${NAME_HAS_FLAG}`).length

export const watchlistHeaderConstructor = () => {
  if (watchlistHeaderHasReady()) {
    return
  }

  const headerWrap = $('.watchlist-header')
  const buttonWarp = headerWrap.find('.watch-list-buttons')

  if (!$(`#${watchlistHeaderConstructor.name}`).length) {
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
