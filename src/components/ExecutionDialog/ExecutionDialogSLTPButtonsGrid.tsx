import { Grid } from '@material-ui/core'
import React from 'react'
import { OwnSLTPToggle } from '~/components/OwnSLTPToggle'

export const ExecutionDialogSLTPButtonsGrid: React.FC<any> = props => {
  return (
    <Grid container direction='column' style={{ marginTop: 4 }}>
      <Grid container item justify='space-around' style={{ marginBottom: 4 }}>
        <Grid item>
          <OwnSLTPToggle which='stopLossLastPercent' />
        </Grid>

        <Grid item>
          <OwnSLTPToggle which='takeProfitLastPercent' />
        </Grid>
      </Grid>
    </Grid>
  )
}
