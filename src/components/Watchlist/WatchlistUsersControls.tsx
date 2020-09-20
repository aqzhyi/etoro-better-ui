import { Button, Grid } from '@material-ui/core'
import TableChartIcon from '@material-ui/icons/TableChart'
import React, { memo } from 'react'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { CheckUserBalanceButton } from '~/components/Watchlist/CheckUserBalanceButton'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'

export const WatchlistUsersControls: React.FunctionComponent<{
  username: string
  cid: string
}> = memo(function WatchlistUsersControls(props) {
  return (
    <Grid container direction='row' spacing={0}>
      <Grid item>
        <AppTooltip
          title={<AppTrans i18nKey='link_checkBalance_text'></AppTrans>}
        >
          <CheckUserBalanceButton cid={props.cid} />
        </AppTooltip>
      </Grid>

      {props.username && (
        <Grid item>
          <AppTooltip
            title={<AppTrans i18nKey='link_portfolio_text'></AppTrans>}
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
          </AppTooltip>
        </Grid>
      )}
    </Grid>
  )
})

GM.addStyle(`
  .${WatchlistUsersControls.name} {
    width: 130px;
    margin-right: 8px;
    margin-top: 4px;
  }
`)
