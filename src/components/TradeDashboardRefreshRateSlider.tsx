import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { AppTrans } from '~/components/AppTrans'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import React from 'react'
import { Slider, FormControlLabel } from '@material-ui/core'

export const TradeDashboardRefreshRateSlider: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const rate = useAppSelector(state => state.settings.tradeDashboardRenderRate)

  return (
    <React.Fragment>
      <FormControlLabel
        label={<AppTrans i18nKey='tradeDashboard_refreshRate_brief'></AppTrans>}
        labelPlacement='top'
        control={
          <Slider
            defaultValue={rate}
            min={50}
            max={5000}
            valueLabelDisplay='auto'
            marks={[
              { value: 50, label: '50 ms' },
              { value: 500, label: '500 ms' },
              { value: 1000, label: '1000 ms' },
              { value: 1500, label: '1500 ms' },
              { value: 5000, label: '5000 ms' },
            ]}
            onChangeCommitted={(event, value) => {
              if (Array.isArray(value)) {
                return
              }

              dispatch(
                setBetterEtoroUIConfig({
                  tradeDashboardRenderRate: value,
                }),
              )
            }}
          ></Slider>
        }
      ></FormControlLabel>
    </React.Fragment>
  )
}
