import { ListItem, ListItemText } from '@material-ui/core'
import { map } from 'lodash'
import React, { Fragment, memo } from 'react'
import { InstrumentPositionListItem } from '~/components/InstrumentPositionListItem'
import { AppTrans } from '~/components/AppTrans'

export const InstrumentPositionGroupListItem: React.FC<{
  positionIds?: InstrumentPosition['PositionID'][]
}> = memo(function InstrumentPositionGroupListItem(props) {
  return (
    <Fragment>
      <ListItem>
        <ListItemText
          primary={<AppTrans i18nKey='tradeDashboard_amount'></AppTrans>}
        ></ListItemText>

        <ListItemText
          primary={<AppTrans i18nKey='tradeDashboard_rates'></AppTrans>}
        ></ListItemText>

        <ListItemText
          primary={<AppTrans i18nKey='tradeDashboard_SLTP'></AppTrans>}
        ></ListItemText>

        <ListItemText
          primary={<AppTrans i18nKey='tradeDashboard_profit'></AppTrans>}
        ></ListItemText>

        <ListItemText
          primary={<AppTrans i18nKey='tradeDashboard_action'></AppTrans>}
        ></ListItemText>
      </ListItem>
      {map(props.positionIds, id => {
        return <InstrumentPositionListItem key={id} positionId={id} />
      })}
    </Fragment>
  )
})
