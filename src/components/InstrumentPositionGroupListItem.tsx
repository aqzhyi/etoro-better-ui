import { ListItem, ListItemText } from '@material-ui/core'
import { map } from 'lodash'
import React, { Fragment } from 'react'
import { InstrumentPosition } from '~/angularAPI'
import { InstrumentPositionListItem } from '~/components/InstrumentPositionListItem'
import { PrimaryTrans } from '~/components/PrimaryTrans'

export const InstrumentPositionGroupListItem: React.FC<{
  positionIds?: InstrumentPosition['PositionID'][]
}> = props => {
  return (
    <Fragment>
      <ListItem>
        <ListItemText
          primary={
            <PrimaryTrans i18nKey='tradeDashboard_amount'></PrimaryTrans>
          }
        ></ListItemText>

        <ListItemText
          primary={<PrimaryTrans i18nKey='tradeDashboard_rates'></PrimaryTrans>}
        ></ListItemText>

        <ListItemText
          primary={<PrimaryTrans i18nKey='tradeDashboard_SLTP'></PrimaryTrans>}
        ></ListItemText>

        <ListItemText
          primary={
            <PrimaryTrans i18nKey='tradeDashboard_profit'></PrimaryTrans>
          }
        ></ListItemText>

        <ListItemText
          primary={
            <PrimaryTrans i18nKey='tradeDashboard_action'></PrimaryTrans>
          }
        ></ListItemText>
      </ListItem>
      {map(props.positionIds, id => {
        return <InstrumentPositionListItem key={id} positionId={id} />
      })}
    </Fragment>
  )
}
