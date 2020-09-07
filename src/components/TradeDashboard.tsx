import { Button, Grid, List, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React, { useEffect } from 'react'
import { useKey } from 'react-use'
import styled from 'styled-components'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { InstrumentPositionGroupListItem } from '~/components/InstrumentPositionGroupListItem'
import { Kbd } from '~/components/Kbd'
import { PingProbeValue } from '~/components/PingProbeValue'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { TradeDashboardRefreshRateSlider } from '~/components/TradeDashboardRefreshRateSlider'
import { TradingStatusValue } from '~/components/TradingStatusValue'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'

const StyledTradeDashboard = styled.span<{
  open: boolean
}>`
  display: ${props => (!props.open && 'none') || 'block'};
  position: fixed;
  top: 60px;
  left: 300px;
  width: calc(100vw - 300px);
  height: calc(100vh - 60px - 80px);
  background: #fff;
  color: #000;
  overflow: auto;
  /** notifications has z-index 40 */
  z-index: 39;
  padding: 8px;

  @media (max-width: 1024px) {
    left: 0;
    width: 100vw;
  }
`

export const TradeDashboard: React.FC = props => {
  const historyIds = useAppSelector(state => state.positions.historyIds)
  const dispatch = useAppDispatch()
  const isActive = useAppSelector(state => state.settings.showTradeDashboard)

  const closeDashboard = () => {
    dispatch(
      setBetterEtoroUIConfig({
        showTradeDashboard: false,
      }),
    )
  }

  useKey('Escape', () => {
    if (angularAPI.executionDialogScope) {
      return
    }

    closeDashboard()
  })

  return (
    <StyledTradeDashboard open={isActive}>
      <Grid
        container
        direction='column'
        style={{
          marginBottom: 300,
        }}
      >
        <Grid item container justify='center'>
          <PrimaryTrans i18nKey='universal_extensionSupportName_text'></PrimaryTrans>
        </Grid>

        <Grid item container justify='center'>
          <Alert severity='warning'>
            <PrimaryTrans i18nKey='common_beta_brief'></PrimaryTrans>
          </Alert>
        </Grid>

        <Grid item container justify='flex-end' alignItems='center' spacing={2}>
          <Grid item>
            <TradingStatusValue></TradingStatusValue>
          </Grid>

          <Grid item>
            <PingProbeValue></PingProbeValue>
          </Grid>

          <Grid item>
            <PrimaryTooltip title={<Kbd>Esc</Kbd>}>
              <Button
                variant='outlined'
                onClick={() => {
                  closeDashboard()
                }}
              >
                <span>❌</span>
              </Button>
            </PrimaryTooltip>
          </Grid>
        </Grid>

        <Grid item container justify='center'>
          <TradeDashboardRefreshRateSlider />
        </Grid>

        <Grid item container>
          <List dense style={{ width: '100%' }}>
            <InstrumentPositionGroupListItem positionIds={historyIds} />
          </List>
        </Grid>
      </Grid>
    </StyledTradeDashboard>
  )
}

registerReactComponent({
  component: <TradeDashboard></TradeDashboard>,
  containerId: TradeDashboard.name,
  containerConstructor: container => {
    $('body').append(container)
  },
})
