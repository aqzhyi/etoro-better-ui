import { Grid } from '@material-ui/core'
import React, { Fragment, memo } from 'react'
import { useMount } from 'react-use'
import { InstrumentIcon } from '~/components/InstrumentIcon'
import { AppTrans } from '~/components/AppTrans'
import { ProfitText } from '~/components/ProfitText'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useDispatchTradeDashboardOpen } from '~/hooks/useDispatchTradeDashboardOpen'
import { usePosition } from '~/hooks/usePosition'

export const PositionBrief: React.FC<{
  id: InstrumentPosition['PositionID']
}> = memo(props => {
  const position = usePosition(props.id)

  useMount(() => {
    position.update()
  })

  if (!position.value) {
    return null
  }

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
          href={`https://www.etoro.com/portfolio/${position.value.Instrument.Name.toLowerCase()}`}
          onClick={() => {
            gaAPI.sendEvent(GaEventId.tradeDashboard_instrumentLinkClick)
          }}
        >
          <InstrumentIcon id={position.value.InstrumentID} />
        </a>
      </Grid>

      <Grid container item direction='column'>
        <Grid item>
          ${position.value.Amount.toFixed(2)} x{position.value.Leverage}
        </Grid>

        <Grid item>
          <ProfitText
            profit={position.value.OpenRate ?? 0}
            pureDollar
            noDollarSign
          ></ProfitText>
          <Fragment> </Fragment>
          {(position.value.IsBuy && (
            <AppTrans i18nKey='tradeDashboard_itBuy'></AppTrans>
          )) || <AppTrans i18nKey='tradeDashboard_itSell'></AppTrans>}
        </Grid>
      </Grid>
    </Grid>
  )
})
