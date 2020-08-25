import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { PrimaryTrans } from '@/components/PrimaryTrans'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { Label, Slider } from '@fluentui/react'
import React from 'react'

export const TradeDashboardRefreshRateSlider: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const rate = useAppSelector(state => state.settings.tradeDashboardRefreshRate)

  return (
    <React.Fragment>
      <Label>
        <PrimaryTrans i18nKey='tradeDashboard_refreshRate_brief'></PrimaryTrans>
      </Label>
      <Slider
        defaultValue={rate}
        min={50}
        max={3000}
        valueFormat={value => {
          return `${value}ms`
        }}
        onChanged={(event, value) => {
          dispatch(
            setBetterEtoroUIConfig({
              tradeDashboardRefreshRate: value,
            }),
          )
        }}
      ></Slider>
    </React.Fragment>
  )
}
