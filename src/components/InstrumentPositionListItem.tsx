/** @jsx jsx */ import { jsx, css } from '@emotion/react'
import AvTimerIcon from '@material-ui/icons/AvTimer'
import {
  Box,
  Button,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import React, { Fragment, memo, useMemo } from 'react'
import { useInterval } from 'react-use'
import { InstrumentRateChangeCount } from '~/components/InstrumentRateChangeCount'
import { PositionBrief } from '~/components/PositionBrief'
import { AppTrans } from '~/components/AppTrans'
import { ProfitText } from '~/components/ProfitText'
import { RateSignalIcon } from '~/components/RateSignalIcon'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useInstrument } from '~/hooks/useInstrument'
import { usePosition } from '~/hooks/usePosition'
import { useAppSelector } from '~/store/_store'
import { AppTooltip } from '~/components/AppTooltip'
import { getRateChangeCount } from '~/utils/getRateChangeCount'

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

  const muiCSS = useStyles()

  // tracing the opening market
  useInterval(
    () => {
      position.update()
    },
    position.closed === false && instrument?.IsActive === false
      ? 30 * 1000
      : null,
  )

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
    return <ListItem></ListItem>
  }

  return (
    <ListItem
      css={css`
        :hover {
          background-color: #d0fff2cc !important;
          filter: none;
          outline: 1px solid #00808073;
        }

        filter: ${!instrument?.IsActive ? `grayscale(1)` : `none`};
        outline: ${position?.closed || position?.closing
          ? `1px solid #bebebe`
          : 'none'};
        transition-duration: ${position.closing ? '2s' : 'none'};
        opacity: ${position.closed || position.closing ? `0.85` : 'auto'};
        pointer-events: ${!position.closed && position.closing
          ? `none`
          : 'auto'};
        transform: ${position.closed
          ? 'none'
          : position.closing
          ? `rotateX(720deg) matrix(1,-0.01,0.4,1,0,1)`
          : 'none'};
        min-height: 60px;
        background-color: ${position.closed ? '#91919155' : 'inherit'};

        ::after {
          content: '';
          display: ${position.closed ? 'inline-block' : 'none'};
          width: 100%;
          height: 0px;
          border: 1px solid #ff00006b;
          position: absolute;
        }
      `}
    >
      <ListItemAvatar>
        <Box minWidth={160}>
          {position && instrument ? (
            <PositionBrief id={position.value.PositionID} />
          ) : (
            <span />
          )}
        </Box>
      </ListItemAvatar>

      <ListItemText
        classes={{
          primary: muiCSS.fontSizeLarge,
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

            <Box display='inline-block' marginLeft={1}>
              <Fragment>( </Fragment>

              <InstrumentRateChangeCount
                current={position.value.CurrentRate}
                isBuy={position.value.IsBuy}
                openRate={position.value.OpenRate}
              />
              <Fragment> )</Fragment>
            </Box>
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
          primary: muiCSS.fontSizeLarge,
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
        <Box display='flex' alignItems='flex-end'>
          {instrument?.IsActive === false ? (
            <AppTooltip
              title={<AppTrans i18nKey='common_marketClose_text'></AppTrans>}
            >
              <AvTimerIcon />
            </AppTooltip>
          ) : (
            <AppTooltip
              title={
                <Fragment>
                  <div>
                    <AppTrans i18nKey='tradeDashboard_actionClose'></AppTrans>
                    <Fragment> @ </Fragment>
                    {position.value.CurrentRate}
                  </div>
                  <Divider></Divider>
                  <div>
                    <Fragment>(</Fragment>
                    {getRateChangeCount(
                      position.value.IsBuy,
                      position.value.OpenRate,
                      position.value.CurrentRate,
                    )}
                    <Fragment>)</Fragment>
                  </div>
                </Fragment>
              }
            >
              <Button
                variant='outlined'
                disabled={position.value.isPendingClose}
                onClick={event => {
                  gaAPI.sendEvent(GaEventId.tradeDashboard_closePositionClick)
                  position.close()
                }}
              >
                {position.closed === true ? (
                  <AppTrans i18nKey='tradeDashboard_positionClosed'></AppTrans>
                ) : (
                  <AppTrans i18nKey='tradeDashboard_actionClose'></AppTrans>
                )}
              </Button>
            </AppTooltip>
          )}
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  )
})
