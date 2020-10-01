import { Grid, styled } from '@material-ui/core'
import React, { memo } from 'react'
import { PositionBrief } from '~/components/PositionBrief'
import { useDialogPostions } from '~/hooks/useDialogPostions'

const GridStyled = styled(Grid)({
  padding: '0 24px',
})

export const ExecutionDialogPostions: React.FC = memo(
  function ExecutionDialogPostions(props) {
    const positions = useDialogPostions()

    positions.acts.useIntervalUpdate()

    return (
      <GridStyled container direction='column'>
        {positions.state().map(position => {
          return (
            <Grid item key={`positionId=${position.PositionID}`}>
              <PositionBrief id={position.PositionID}></PositionBrief>
            </Grid>
          )
        })}
      </GridStyled>
    )
  },
)
