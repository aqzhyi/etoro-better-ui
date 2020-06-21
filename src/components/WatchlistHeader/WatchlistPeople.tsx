import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '@/store/_store'
import { WatchlistUserControls } from '@/components/WatchlistUserControls/WatchlistUserControls'

export const renderWatchlistPeople = () => {
  $('et-user-row').each((index, element) => {
    const userFinder = $(element)
    const hasAppended = !!userFinder.find('.user-meta').length

    if (hasAppended) {
      return
    }

    /**
     * tests https://regexr.com/52ft5
     *
     * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726/3.jpg
     * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726.jpg
     * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/6441059/21.jpg
     */
    const cid = /avatars\/[\d]+[xX][\d]+\/(?<cid>[\d]+)\/?/.exec(
      $(element).find('[automation-id="trade-item-avatar"]').attr('src') || '',
    )?.groups?.cid

    const traderName = $(element)
      .find('[automation-id="trade-item-name"]')
      .html()

    if (cid && !hasAppended) {
      userFinder.prepend(
        $(`<span class="user-meta" id="user-meta-${cid}"></span>`),
      )

      ReactDOM.render(
        <Provider store={store}>
          <WatchlistUserControls cid={cid} traderName={traderName} />
        </Provider>,
        globalThis.document.querySelector(`#user-meta-${cid}`),
      )
    }
  })
}
