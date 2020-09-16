import { Grid } from '@material-ui/core'
import React from 'react'
import { UseOwnSLTPButton } from '~/components/UseOwnSLTPButton'

export const ExecutionDialogSLTPButtonsGrid: React.FC<any> = props => {
  return (
    <Grid container direction='column' style={{ marginTop: 4 }}>
      <Grid container item justify='space-around' style={{ marginBottom: 4 }}>
        <Grid item>
          <UseOwnSLTPButton which='stopLossLastPercent' />
        </Grid>

        <Grid item>
          <UseOwnSLTPButton which='takeProfitLastPercent' />
        </Grid>
      </Grid>
    </Grid>
  )
}
