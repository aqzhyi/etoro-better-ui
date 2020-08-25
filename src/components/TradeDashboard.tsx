import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { Kbd } from '~/components/Kbd'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { ProfitText } from '~/components/ProfitText'
import { TradeDashboardRefreshRateSlider } from '~/components/TradeDashboardRefreshRateSlider'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'
import { usePortfolio } from '~/hooks/usePortfolio'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { PrimaryButton } from '@fluentui/react'
import dayjs from 'dayjs'
import { map } from 'lodash'
import React from 'react'
import { useInterval, useKey, useList, useMount } from 'react-use'
import styled from 'styled-components'
import { angularAPI } from '~/angularAPI'

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
  z-index: 50;

  @media (max-width: 1024px) {
    left: 0;
    width: 100vw;
  }
`

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 170px 90px 120px 250px 80px auto;
  margin: 8px;
  line-height: 32px;

  :hover {
    background-color: #dbdbdbcc;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 90px 120px 250px 80px auto;
  }
`

export const TradeDashboard: React.FC = props => {
  const protfolio = usePortfolio()
  const dispatch = useAppDispatch()
  const isActive = useAppSelector(state => state.settings.showTradeDashboard)
  const [closing, closingAct] = useList<number>([])
  const refreshRate = useAppSelector(
    state => state.settings.tradeDashboardRefreshRate,
  )

  const closeDashboard = () => {
    dispatch(
      setBetterEtoroUIConfig({
        showTradeDashboard: false,
      }),
    )
  }

  useMount(() => {
    closeDashboard()
  })

  useKey('Escape', () => {
    if (angularAPI.executionDialogScope) {
      return
    }

    closeDashboard()
  })

  useInterval(() => {
    protfolio.update()
  }, (isActive && refreshRate) || null)

  return (
    <StyledTradeDashboard open={isActive}>
      <div style={{ textAlign: 'center' }}>
        <PrimaryTrans i18nKey='universal_extensionSupportName_text'></PrimaryTrans>
      </div>

      <div style={{ margin: 8, textAlign: 'right' }}>
        <PrimaryTooltip overlay={() => <Kbd>Esc</Kbd>}>
          <PrimaryButton
            onClick={() => {
              closeDashboard()
            }}
          >
            <span>❌</span>
          </PrimaryButton>
        </PrimaryTooltip>
      </div>

      <StyledRow>
        <span className='hideOnMax1024'>
          <PrimaryTrans i18nKey='tradeDashboard_openDate'></PrimaryTrans>
        </span>
        <span>
          <PrimaryTrans i18nKey='tradeDashboard_instrumentName'></PrimaryTrans>
        </span>
        <span>
          <PrimaryTrans i18nKey='tradeDashboard_amount'></PrimaryTrans>
        </span>
        <span>
          <PrimaryTrans i18nKey='tradeDashboard_rates'></PrimaryTrans>
        </span>
        <span>
          <PrimaryTrans i18nKey='tradeDashboard_profit'></PrimaryTrans>
        </span>
        <span>
          <PrimaryTrans i18nKey='tradeDashboard_action'></PrimaryTrans>
        </span>
      </StyledRow>

      {map(protfolio.value?.manualPositions, position => {
        const openAt = dayjs(position.OpenDateTime).format(
          'YYYY/MM/DD hh:mm:ss',
        )

        return (
          <StyledRow key={position.PositionID}>
            <span className='hideOnMax1024'>
              <PrimaryTooltip overlay={position.PositionID}>
                {openAt}
              </PrimaryTooltip>
            </span>

            <span>{position.Instrument.Name}</span>

            <span>
              ${position.Amount} x{position.Leverage}
            </span>

            <span>
              <React.Fragment>
                <PrimaryTooltip
                  overlay={
                    <PrimaryTrans i18nKey='tradeDashboard_openRate'></PrimaryTrans>
                  }
                >
                  {position.OpenRate} {(position.IsBuy && '📈') || '📉'}
                </PrimaryTooltip>
              </React.Fragment>

              <React.Fragment>
                {' '}
                @{' '}
                <ProfitText
                  profit={position.CurrentRate}
                  noDollarSign
                  pureDollar
                ></ProfitText>
              </React.Fragment>

              <React.Fragment>
                {' '}
                (
                <ProfitText
                  profit={
                    (position.IsBuy &&
                      position.CurrentRate - position.OpenRate) ||
                    position.OpenRate - position.CurrentRate
                  }
                  noDollarSign
                ></ProfitText>
                )
              </React.Fragment>
            </span>

            <ProfitText profit={position.Profit}></ProfitText>

            <PrimaryButton
              disabled={
                position.isPendingClose || closing.includes(position.PositionID)
              }
              onClick={event => {
                gaAPI.sendEvent(GaEventId.tradeDashboard_closePositionClick)
                position.close()
                closingAct.push(position.PositionID)
              }}
            >
              <PrimaryTrans i18nKey='tradeDashboard_actionClose'></PrimaryTrans>
            </PrimaryButton>
          </StyledRow>
        )
      })}

      <div style={{ margin: 8 }}>
        <PrimaryTrans i18nKey='common_beta_brief'></PrimaryTrans>
      </div>

      <div style={{ margin: 8 }}>
        <TradeDashboardRefreshRateSlider />
      </div>
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

GM.addStyle(`
  @media (max-width: 1024px) {
    .hideOnMax1024 {
      display: none;
    }
  }
`)
