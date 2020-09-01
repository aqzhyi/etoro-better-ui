import LoopIcon from '@material-ui/icons/Loop'
import React, { Fragment } from 'react'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { useAppSelector } from '~/store/_store'

export const TradingStatusValue: React.FC<{
  asTooltip?: boolean
}> = props => {
  const statusInfo = useAppSelector(state => state.status.statusCheckAggregate)

  const loading = !statusInfo['Manual trading - Real']

  const good = statusInfo['Manual trading - Real']?.status === 'Operational'

  const etoroAnnouncement =
    statusInfo['Manual trading - Real']?.status || 'ERROR'

  if (!props.asTooltip) {
    return (
      <Fragment>
        <PrimaryTrans i18nKey='etoroStatus_ManualTrade_text'></PrimaryTrans>

        {good ? '👍' : loading ? <LoopIcon /> : etoroAnnouncement}

        <a
          style={{ color: 'blue' }}
          href='https://status.etoro.com/'
          target='_blank'
        >
          {' '}
          (Ref)
        </a>
      </Fragment>
    )
  }

  return (
    <PrimaryTooltip
      title={
        <PrimaryTrans i18nKey='etoroStatus_ManualTrade_text'></PrimaryTrans>
      }
    >
      {props.children}
    </PrimaryTooltip>
  )
}
