import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import { Button } from '@material-ui/core'
import { stringifyUrl } from 'query-string'
import React from 'react'
import { useAsyncFn } from 'react-use'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'

export const CheckUserBalanceButton: React.FC<{ cid: string }> = props => {
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
  }, [])

  return (
    <Button
      size='small'
      variant='outlined'
      onClick={() => {
        equityQuery()
        gaAPI.sendEvent(GaEventId.watchlists_checkUserBalance)
      }}
    >
      {equityState.value ? `${equityState.value}%` : <MonetizationOnIcon />}
    </Button>
  )
}
