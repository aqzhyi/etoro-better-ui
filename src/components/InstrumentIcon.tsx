import { Grid, makeStyles } from '@material-ui/core'
import React, { Fragment, memo } from 'react'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { ProfitText } from '~/components/ProfitText'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useDispatchTradeDashboardOpen } from '~/hooks/useDispatchTradeDashboardOpen'

const useStyled = makeStyles({
  imageBox: {
    display: 'inline-block',
    position: 'relative',
    backgroundImage: (props: { url: string }) => `url(${props.url})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: 30,
    width: 30,
    outline: '1px solid #b7b7b7',
  },
  name: {
    display: 'inline-block',
    textShadow: '1px 1px 2px #c5c5c5',
    fontSize: 12,
    color: '#000',
    position: 'absolute',
    top: 22,
    left: -10,
  },
})

export const InstrumentIcon: React.FC<{
  name: string
  avatar: string
  amount: number
  openRate: number
  leverages: number
  isBuy: boolean
}> = memo(props => {
  const tradeDashboard = useDispatchTradeDashboardOpen()
  const css = useStyled({
    url: props.avatar,
  })

  return (
    <Grid
      container
      direction='row'
      justify='space-between'
      wrap='nowrap'
      alignItems='center'
      spacing={2}
    >
      <Grid item>
        <a
          href={
            closed
              ? `https://www.etoro.com/markets/${props.name?.toLowerCase()}`
              : `https://www.etoro.com/portfolio/${props.name?.toLowerCase()}`
          }
          onClick={() => {
            tradeDashboard.close()
            gaAPI.sendEvent(GaEventId.tradeDashboard_instrumentLinkClick)
          }}
        >
          <span className={css.imageBox}>
            <span className={css.name}>{props.name}</span>
          </span>
        </a>
      </Grid>

      <Grid container item direction='column'>
        <Grid item>
          ${props.amount.toFixed(2)} x{props.leverages}
        </Grid>

        <Grid item>
          <ProfitText
            profit={props.openRate ?? 0}
            pureDollar
            noDollarSign
          ></ProfitText>
          <Fragment> </Fragment>
          {(props.isBuy && (
            <PrimaryTrans i18nKey='tradeDashboard_itBuy'></PrimaryTrans>
          )) || <PrimaryTrans i18nKey='tradeDashboard_itSell'></PrimaryTrans>}
        </Grid>
      </Grid>
    </Grid>
  )
})
