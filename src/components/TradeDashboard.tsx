import { Button, Grid, List, styled } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React from 'react'
import { useKey } from 'react-use'
import { angularAPI } from '~/angularAPI'
import { InstrumentPositionGroupListItem } from '~/components/InstrumentPositionGroupListItem'
import { Kbd } from '~/components/Kbd'
import { PingProbeValue } from '~/components/PingProbeValue'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { TradeDashboardRefreshRateSlider } from '~/components/TradeDashboardRefreshRateSlider'
import { TradingStatusValue } from '~/components/TradingStatusValue'
import { useDispatchTradeDashboardOpen } from '~/hooks/useDispatchTradeDashboardOpen'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'

const Panel = styled('div')({
  transitionDuration: '0.3s',
  transform: (props: { open: boolean }) =>
    props.open ? '' : 'translateX(100vw)',
  diaplay: 'block',
  position: 'fixed',
  top: 60,
  left: 300,
  width: 'calc(100vw - 300px)',
  height: 'calc(100vh - 60px - 80px)',
  background: '#fff',
  color: '#000',
  overflow: 'auto',
  zIndex: 39,
  padding: 8,
  '@media (max-width: 1024px)': {
    left: 0,
    width: '100vw',
  },
})

export const TradeDashboard: React.FC = props => {
  const dispatch = useAppDispatch()
  const historyIds = useAppSelector(state => state.positions.historyIds)
  const isOpen = useAppSelector(state => state.display.tradeDashboard)
  const tradeDashboard = useDispatchTradeDashboardOpen()

  useKey('Escape', () => {
    if (angularAPI.executionDialogScope) {
      return
    }

    tradeDashboard.close()
  })

  return (
    <Panel open={isOpen}>
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
                  tradeDashboard.close()
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
    </Panel>
  )
}

registerReactComponent({
  component: <TradeDashboard></TradeDashboard>,
  containerId: TradeDashboard.name,
  containerConstructor: container => {
    $('body').append(container)
  },
})
