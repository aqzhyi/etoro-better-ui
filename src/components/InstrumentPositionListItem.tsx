import {
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import React, { Fragment, memo } from 'react'
import { useInterval } from 'react-use'
import styled from 'styled-components'
import { InstrumentRateChangeCount } from '~/components/InstrumentRateChangeCount'
import { PositionBrief } from '~/components/PositionBrief'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { ProfitText } from '~/components/ProfitText'
import { RateSignalIcon } from '~/components/RateSignalIcon'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useInstrument } from '~/hooks/useInstrument'
import { usePosition } from '~/hooks/usePosition'
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

  filter: ${props => (!props.active ? `grayscale(1)` : `none`)};
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

  ::after {
    content: '';
    display: ${props => (props.closed ? 'inline-block' : 'none')};
    width: 100%;
    height: 0px;
    border: 1px solid #ff00006b;
    position: absolute;
  }
`

const useStyles = makeStyles({
  fontSizeLarge: {
    fontSize: '1rem',
  },
})

export const InstrumentPositionListItem: React.FC<{
  positionId?: InstrumentPosition['PositionID']
}> = memo(function InstrumentPositionListItem(props) {
  const position = usePosition(props.positionId ?? 0)
  const instrument = useInstrument(position.value?.InstrumentID ?? 0)
  const updateRate = useAppSelector(
    state => state.settings.tradeDashboardRenderRate,
  )
  const dashboardOpen = useAppSelector(state => state.display.tradeDashboard)

  const css = useStyles()

  // tracing the opening market
  useInterval(
    () => {
      if (
        !props.positionId ||
        position.closed === true ||
        instrument?.IsActive === false
      ) {
        return
      }

      position.update()
    },
    dashboardOpen && props.positionId ? updateRate : null,
  )

  if (!position.value) {
    return <StyledListItem></StyledListItem>
  }

  return (
    <StyledListItem
      closed={position.closed === true ? 'true' : undefined}
      closing={position.closing === true ? 'true' : undefined}
      active={instrument?.IsActive ? 'true' : undefined}
    >
      <ListItemAvatar>
        {position && instrument ? (
          <PositionBrief id={position.value.PositionID} />
        ) : (
          <span />
        )}
      </ListItemAvatar>

      <ListItemText
        classes={{
          primary: css.fontSizeLarge,
        }}
        primary={
          <Fragment>
            <RateSignalIcon change={position.value.LastRateChange} />

            <ProfitText
              profit={position.value.CurrentRate}
              noDollarSign
              noNegative
              pureDollar
            ></ProfitText>

            <Fragment> </Fragment>

            <ProfitText
              profit={position.value.LastRateChange}
              noDollarSign
            ></ProfitText>

            <span style={{ marginLeft: 4 }}>
              <Fragment>(</Fragment>

              <InstrumentRateChangeCount
                current={position.value.CurrentRate}
                isBuy={position.value.IsBuy}
                openRate={position.value.OpenRate}
              />
              <Fragment> )</Fragment>
            </span>
          </Fragment>
        }
      ></ListItemText>

      <ListItemText
        primary={
          <Fragment>
            <ProfitText
              profit={position.value.StopLossPercent}
              suffix='%'
              noDollarSign
            ></ProfitText>
          </Fragment>
        }
        secondary={
          <Fragment>
            <ProfitText
              profit={position.value.TakeProfitPercent}
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
              profit={(position.value.Profit / position.value.Amount) * 100}
              noDollarSign
              suffix={'%'}
            ></ProfitText>

            <Fragment> </Fragment>

            <ProfitText profit={position.value.Profit}></ProfitText>
          </Fragment>
        }
      ></ListItemText>

      <ListItemSecondaryAction>
        <Button
          variant='outlined'
          disabled={position.value.isPendingClose}
          onClick={event => {
            gaAPI.sendEvent(GaEventId.tradeDashboard_closePositionClick)
            position.close()
          }}
        >
          {position.closed === true ? (
            <PrimaryTrans i18nKey='tradeDashboard_positionClosed'></PrimaryTrans>
          ) : (
            <PrimaryTrans i18nKey='tradeDashboard_actionClose'></PrimaryTrans>
          )}
        </Button>
      </ListItemSecondaryAction>
    </StyledListItem>
  )
})
