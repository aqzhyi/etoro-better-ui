import LoopIcon from '@material-ui/icons/Loop'
import React, { Fragment } from 'react'
import { NotableText } from '~/components/NotableText'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
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
        <AppTrans i18nKey='etoroStatus_ManualTrade_text'></AppTrans>

        {good ? (
          '👍'
        ) : loading ? (
          <LoopIcon />
        ) : (
          <Fragment>
            <NotableText>{etoroAnnouncement}</NotableText>
            😨
          </Fragment>
        )}

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
    <AppTooltip
      title={<AppTrans i18nKey='etoroStatus_ManualTrade_text'></AppTrans>}
    >
      {props.children}
    </AppTooltip>
  )
}
