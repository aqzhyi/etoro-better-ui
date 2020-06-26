import { debugAPI } from '@/debugAPI'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import store from '@/store/_store'
import { stringifyUrl } from 'query-string'
import React from 'react'
import { Provider } from 'react-redux'
import { useAsyncFn } from 'react-use'
import { stickReactComponent } from '@/utils/stickReactComponent'
import { getRandomString } from '@/utils/getRandomString'
import { DefaultButton, Stack } from '@fluentui/react'

export const WatchlistUsersControls: React.FunctionComponent<{
  username: string
  cid: string
}> = props => {
  const [equityState, equityQuery] = useAsyncFn(() => {
    return GM.ajax({
      method: 'GET',
      url: stringifyUrl({
        url:
          'https://www.etoro.com/sapi/trade-data-real/live/public/portfolios',
        query: {
          cid: props.cid,
        },
      }),
    })
      .then(event => {
        const model = JSON.parse(
          /var model = (?<model>\{[\s\S]+\}),/i.exec(event.responseText)?.groups
            ?.model || `{}`,
        ) as {
          /** 餘額 */
          CreditByRealizedEquity?: number
        }

        return model.CreditByRealizedEquity?.toFixed(2)
      })
      .catch(error => {
        return Promise.reject(error)
      })
      .finally(() => {
        debugAPI.log(`獲取 cid=${props.cid} 的餘額`)
      })
  }, [])

  const minimalStyle: React.CSSProperties = {
    paddingLeft: '2px',
    paddingRight: '2px',
  }

  return (
    <Stack tokens={{ childrenGap: 1 }} horizontal>
      <DefaultButton
        style={minimalStyle}
        iconProps={{
          iconName: equityState.loading ? 'Refresh' : 'AllCurrency',
        }}
        onClick={() => {
          equityQuery()
        }}
      >
        {equityState.value ? `${equityState.value}%` : i18n.餘額()}
      </DefaultButton>

      {props.username && (
        <DefaultButton style={minimalStyle}>
          <a href={`/people/${props.username.toLowerCase()}/portfolio`}>
            {i18n.投資組合()}
          </a>
        </DefaultButton>
      )}
    </Stack>
  )
}

export const unmountWatchlistUsersControlsList: ReturnType<
  typeof stickReactComponent
>['unmount'][] = []

export const renderWatchlistPeople = () => {
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
       * tests https://regexr.com/52ft5
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

      const { mount, unmount } = stickReactComponent({
        component: (
          <Provider store={store}>
            <WatchlistUsersControls cid={cid} username={username} />
          </Provider>
        ),
        containerId: `WatchlistUsersControls-${eachId}`,
        containerConstructor: containerElement => {
          $(containerElement).addClass(WatchlistUsersControls.name)
          userRowElement.prepend(containerElement)
        },
      })

      mount()

      unmountWatchlistUsersControlsList.push(unmount)
    }
  })
}

GM.addStyle(`
  .${WatchlistUsersControls.name} {
    margin-right: 8px;
    margin-top: 4px;
  }
`)
