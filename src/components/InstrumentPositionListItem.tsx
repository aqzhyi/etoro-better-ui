import {
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { useInterval } from 'react-use'
import styled from 'styled-components'
import { InstrumentPosition } from '~/angularAPI'
import { InstrumentIcon } from '~/components/InstrumentIcon'
import { InstrumentRateChangeCount } from '~/components/InstrumentRateChangeCount'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { ProfitText } from '~/components/ProfitText'
import { RateSignalIcon } from '~/components/RateSignalIcon'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useDispatchTradeDashboardOpen } from '~/hooks/useDispatchTradeDashboardOpen'
import { useInstrumentPosition } from '~/hooks/useInstrumentPosition'
import { useAppSelector } from '~/store/_store'

const StyledListItem = styled(ListItem)<{
  closing?: boolean
  closed?: boolean
  active?: boolean
}>`
  :hover {
    background-color: #d0fff2cc !important;
    filter: none;
    outline: 1px solid #00808073;
  }

  filter: ${props => (props.closed || !props.active ? `grayscale(1)` : `none`)};
  outline: ${props =>
    props.closed || props.closing ? `1px solid #bebebe` : 'none'};
  transition-duration: ${props => (props.closing ? '2s' : 'none')};
  opacity: ${props => (props.closed || props.closing ? `0.85` : 'auto')};
  pointer-events: ${props =>
    !props.closed && props.closing ? `none` : 'auto'};
  transform: ${props =>
    props.closed
      ? 'none'
      : props.closing
      ? `rotateX(360deg) matrix(1, -0.05, 0, 1, 0, 1)`
      : 'none'};
  min-height: 60px;
  background-color: ${props => (props.closed ? '#91919155' : 'inherit')};
`

const useStyles = makeStyles({
  fontSizeLarge: {
    fontSize: '1rem',
  },
})

export const InstrumentPositionListItem: React.FC<{
  positionId?: InstrumentPosition['PositionID']
}> = props => {
  const tradeDashboard = useDispatchTradeDashboardOpen()
  const {
    closed,
    closing,
    setClosing,
    position,
    update,
  } = useInstrumentPosition(props.positionId)
  const updateRate = useAppSelector(
    state => state.settings.tradeDashboardRefreshRate,
  )
  const dashboardOpen = useAppSelector(state => state.display.tradeDashboard)

  const css = useStyles()

  // tracing the opening market
  useInterval(() => {
    if (!props.positionId || closed || !position?.Instrument.IsActive) {
      return
    }

    update()
  }, (dashboardOpen && props.positionId && updateRate) || null)

  useInterval(() => {
    // if you can't close the position, revert closing prop when update
    setClosing(false)
  }, (props.positionId && !closed && 5000) || null)

  if (!position) {
    return <StyledListItem></StyledListItem>
  }

  return (
    <StyledListItem
      closed={closed ? 'true' : undefined}
      closing={closing ? 'true' : undefined}
      active={position.Instrument.IsActive ? 'true' : undefined}
    >
      <ListItemAvatar>
        <a
          href={
            closed
              ? `https://www.etoro.com/markets/${position.Instrument.Name.toLowerCase()}`
              : `https://www.etoro.com/portfolio/${position.Instrument.Name.toLowerCase()}`
          }
          onClick={() => {
            tradeDashboard.close()
          }}
        >
          <InstrumentIcon instrument={position.Instrument}></InstrumentIcon>
        </a>
      </ListItemAvatar>

      <ListItemText
        classes={{
          primary: css.fontSizeLarge,
          secondary: css.fontSizeLarge,
        }}
        primary={
          <Fragment>
            ${position.Amount} x{position.Leverage}
          </Fragment>
        }
        secondary={
          <Fragment>
            <ProfitText
              profit={position.OpenRate}
              pureDollar
              noDollarSign
            ></ProfitText>
            <Fragment> </Fragment>
            {(position.IsBuy && (
              <PrimaryTrans i18nKey='tradeDashboard_itBuy'></PrimaryTrans>
            )) || <PrimaryTrans i18nKey='tradeDashboard_itSell'></PrimaryTrans>}
          </Fragment>
        }
      ></ListItemText>

      <ListItemText
        classes={{
          primary: css.fontSizeLarge,
        }}
        primary={
          <Fragment>
            <RateSignalIcon change={position.LastRateChange} />

            {/* Open Rate */}
            <ProfitText
              profit={position.CurrentRate}
              noDollarSign
              noNegative
              pureDollar
            ></ProfitText>

            <Fragment> </Fragment>

            {/* Change Rate count per-tick of up/down */}
            <ProfitText
              profit={position.LastRateChange}
              noDollarSign
            ></ProfitText>

            <span style={{ marginLeft: 4 }}>
              <Fragment>( </Fragment>
              {/* up/down rate count with Open Rate */}
              <InstrumentRateChangeCount position={position} />
              <Fragment> )</Fragment>
            </span>
          </Fragment>
        }
      ></ListItemText>

      <ListItemText
        primary={
          <Fragment>
            <ProfitText
              profit={position.StopLossPercent}
              suffix='%'
              noDollarSign
            ></ProfitText>
          </Fragment>
        }
        secondary={
          <Fragment>
            <ProfitText
              profit={position.TakeProfitPercent}
              suffix='%'
              noDollarSign
            ></ProfitText>
          </Fragment>
        }
      ></ListItemText>

      <ListItemText
        classes={{
          primary: css.fontSizeLarge,
        }}
        primary={
          <Fragment>
            <ProfitText
              profit={(position.Profit / position.Amount) * 100}
              noDollarSign
              suffix={'%'}
            ></ProfitText>

            <Fragment> </Fragment>

            <ProfitText profit={position.Profit}></ProfitText>
          </Fragment>
        }
      ></ListItemText>

      <ListItemSecondaryAction>
        <Button
          variant='outlined'
          disabled={position.isPendingClose}
          onClick={event => {
            gaAPI.sendEvent(GaEventId.tradeDashboard_closePositionClick)
            position.close()
          }}
        >
          {closed ? (
            <PrimaryTrans i18nKey='tradeDashboard_positionClosed'></PrimaryTrans>
          ) : (
            <PrimaryTrans i18nKey='tradeDashboard_actionClose'></PrimaryTrans>
          )}
        </Button>
      </ListItemSecondaryAction>
    </StyledListItem>
  )
}
