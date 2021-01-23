import React, { useEffect, useState } from 'react'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { WatchlistUsersControls } from '~/components/Watchlist/WatchlistUsersControls'
import { getRandomString } from '~/utils/getRandomString'
import { useMount } from 'react-use'

const findAndRegister = () => {
  $('et-user-row').each((index, element) => {
    const userRowElement = $(element)

    if (userRowElement.length) {
      const eachId =
        userRowElement
          .find('.card-avatar-wrap')
          .attr('href')
          ?.replace(/\//gi, '') || getRandomString()

      const username = userRowElement
        .find('[automation-id="trade-item-name"]')
        .html()

      /**
       * Tests https://regexr.com/52ft5
       *
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726/3.jpg
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/1724726.jpg
       * [PASS] https://etoro-cdn.etorostatic.com/avatars/150X150/6441059/21.jpg
       */
      const cid =
        /avatars\/[\d]+[xX][\d]+\/(?<cid>[\d]+)\/?/.exec(
          userRowElement
            ?.find('[automation-id="trade-item-avatar"]')
            .attr('src') || '',
        )?.groups?.cid || '__UNKNOWN-CID__'

      const containerId = `WatchlistUsersControls-${eachId}`

      const component = registerReactComponent<typeof WatchlistUsersControls>({
        component: <WatchlistUsersControls cid={cid} username={username} />,
        containerId: containerId,
        containerConstructor: (containerElement, { componentProps }) => {
          const container$el = $(containerElement)

          container$el.addClass(WatchlistUsersControls.name)

          $('[automation-id="trade-item-name"]')
            .filter((index, element) => {
              return element.innerHTML.trim().includes(componentProps.username)
            })
            .closest('et-user-row')
            .prepend(container$el)
        },
      })

      component.mount()
    }
  })
}

export const WatchlistFindAndRegister = () => {
  // const href = useAppSelector(state => state.settings.locationHref)

  useMount(() => {
    findAndRegister()
  })

  return <React.Fragment></React.Fragment>
}

// registerReactComponent({
//   component: <WatchlistFindAndRegister />,
//   containerId: WatchlistFindAndRegister.name,
//   containerConstructor: containerElement => {
//     $(`[automation-id="watchlist-list-header-people"]`).append(containerElement)
//   },
// })
