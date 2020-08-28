import { Button, Grid, Tooltip } from '@material-ui/core'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import TableChartIcon from '@material-ui/icons/TableChart'
import { stringifyUrl } from 'query-string'
import React from 'react'
import { useAsyncFn } from 'react-use'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { debugAPI } from '~/debugAPI'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'

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

  return (
    <Grid container direction='row' spacing={0}>
      <Grid item>
        <Tooltip
          arrow
          placement='right'
          title={<PrimaryTrans i18nKey='link_checkBalance_text'></PrimaryTrans>}
        >
          <Button
            size='small'
            variant='outlined'
            onClick={() => {
              equityQuery()
              gaAPI.sendEvent(GaEventId.watchlists_balanceLinkClick)
            }}
          >
            {equityState.value ? (
              `${equityState.value}%`
            ) : (
              <MonetizationOnIcon />
            )}
          </Button>
        </Tooltip>
      </Grid>

      {props.username && (
        <Grid item>
          <Tooltip
            arrow
            placement='right'
            title={<PrimaryTrans i18nKey='link_portfolio_text'></PrimaryTrans>}
          >
            <a
              href={`/people/${props.username.toLowerCase()}/portfolio`}
              onClick={() => {
                gaAPI.sendEvent(GaEventId.watchlists_portfolioLinkClick)
              }}
            >
              <Button size='small' variant='outlined'>
                <TableChartIcon />
              </Button>
            </a>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  )
}

GM.addStyle(`
  .${WatchlistUsersControls.name} {
    width: 130px;
    margin-right: 8px;
    margin-top: 4px;
  }
`)
