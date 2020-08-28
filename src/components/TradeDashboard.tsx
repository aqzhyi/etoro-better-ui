import { Button } from '@material-ui/core'
import dayjs from 'dayjs'
import { map } from 'lodash'
import React, { useEffect } from 'react'
import { useInterval, useKey, useList, useMount } from 'react-use'
import styled from 'styled-components'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
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

const StyledRow = styled.div<{ closing?: boolean }>`
  display: grid;
  grid-template-columns: 90px 120px 250px 80px auto;
  margin: 8px;
  line-height: 32px;
  transition-duration: 3s;

  :hover {
    background-color: #dbdbdbcc;
  }

  ${props => {
    if (props.closing) {
      return `
        filter: blur(1px);
        opacity: 0;
        pointer-events: none;
      `
    }
  }}
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

  useEffect(() => {
    if (!isActive) {
      closingAct.clear()
    }
  }, [closingAct, isActive])

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
    if (!isActive) return

    protfolio.update()
  }, (isActive && refreshRate) || null)

  return (
    <StyledTradeDashboard open={isActive}>
      <div style={{ textAlign: 'center' }}>
        <PrimaryTrans i18nKey='universal_extensionSupportName_text'></PrimaryTrans>
      </div>

      <div style={{ margin: 8, textAlign: 'right' }}>
        <PrimaryTooltip overlay={() => <Kbd>Esc</Kbd>}>
          <Button
            variant='outlined'
            onClick={() => {
              closeDashboard()
            }}
          >
            <span>❌</span>
          </Button>
        </PrimaryTooltip>
      </div>

      <div style={{ margin: 8 }}>
        <TradeDashboardRefreshRateSlider />
      </div>

      <StyledRow>
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
          <StyledRow
            key={position.PositionID}
            closing={closing.includes(position.PositionID)}
          >
            <span>
              <PrimaryTooltip overlay={`ID=${position.PositionID} @ ${openAt}`}>
                {position.Instrument.Name}
              </PrimaryTooltip>
            </span>

            <span>
              <ProfitText profit={position.Amount}></ProfitText> x
              {position.Leverage}
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

            <Button
              variant='outlined'
              disabled={position.isPendingClose}
              onClick={event => {
                gaAPI.sendEvent(GaEventId.tradeDashboard_closePositionClick)
                position.close()
                closingAct.push(position.PositionID)
              }}
            >
              <PrimaryTrans i18nKey='tradeDashboard_actionClose'></PrimaryTrans>
            </Button>
          </StyledRow>
        )
      })}

      <div style={{ margin: 8 }}>
        <PrimaryTrans i18nKey='common_beta_brief'></PrimaryTrans>
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
