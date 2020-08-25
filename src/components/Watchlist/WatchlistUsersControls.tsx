import { debugAPI } from '~/debugAPI'
import { GM } from '~/GM'
import { stringifyUrl } from 'query-string'
import React from 'react'
import { useAsyncFn } from 'react-use'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { getRandomString } from '~/utils/getRandomString'
import { DefaultButton, Stack } from '@fluentui/react'
import { gaAPI, GaEventId } from '~/gaAPI'
import { PrimaryTrans } from '~/components/PrimaryTrans'

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
          gaAPI.sendEvent(GaEventId.watchlists_balanceLinkClick)
        }}
      >
        {equityState.value ? (
          `${equityState.value}%`
        ) : (
          <PrimaryTrans i18nKey='link_checkBalance_text'></PrimaryTrans>
        )}
      </DefaultButton>

      {props.username && (
        <DefaultButton style={minimalStyle}>
          <a
            href={`/people/${props.username.toLowerCase()}/portfolio`}
            onClick={() => {
              gaAPI.sendEvent(GaEventId.watchlists_portfolioLinkClick)
            }}
          >
            <PrimaryTrans i18nKey='link_portfolio_text'></PrimaryTrans>
          </a>
        </DefaultButton>
      )}
    </Stack>
  )
}

GM.addStyle(`
  .${WatchlistUsersControls.name} {
    margin-right: 8px;
    margin-top: 4px;
  }
`)
