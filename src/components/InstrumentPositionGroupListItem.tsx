import { map } from 'lodash'
import React, { Fragment } from 'react'
import { InstrumentPosition } from '~/angularAPI'
import { InstrumentPositionListItem } from '~/components/InstrumentPositionListItem'

export const InstrumentPositionGroupListItem: React.FC<{
  positionIds?: InstrumentPosition['PositionID'][]
}> = props => {
  return (
    <Fragment>
      {map(props.positionIds, id => {
        return <InstrumentPositionListItem key={id} positionId={id} />
      })}
    </Fragment>
  )
}
