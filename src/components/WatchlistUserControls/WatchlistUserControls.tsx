import React from 'react'
import { Button, Tooltip } from '@blueprintjs/core'
import { useAsyncFn } from 'react-use'
import { GM } from '@/GM'
import { stringifyUrl } from 'query-string'
import { debugAPI } from '@/debugAPI'
import toast from 'cogo-toast'

export const WatchlistUserControls: React.FunctionComponent<{
  cid: string
  traderName: string
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
          /var model = (?<model>{[\s\S]+}),/i.exec(event.responseText)?.groups
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
    <span>
      <Button
        loading={equityState.loading}
        icon={'dollar'}
        onClick={() => {
          equityQuery()
        }}
      >
        {equityState.value ? `${equityState.value}%` : '餘額'}
      </Button>

      <Button>
        <a href={`/people/${props.traderName.toLowerCase()}/portfolio`}>
          投資組合
        </a>
      </Button>
    </span>
  )
}
