import { toCurrency } from '@/toCurrency'
import React from 'react'
import { stickReactComponent } from '@/utils/stickReactComponent'
import { Provider } from 'react-redux'
import store, { useAppSelector } from '@/store/_store'
import { angularAPI } from '@/angularAPI'
import { GM } from '@/GM'
import { throttle } from 'lodash'

const FooterUnitValue: React.FC<{
  USD: number
}> = props => {
  const selected = useAppSelector(
    state => state.settings.betterEtoroUIConfig.selectedExchange,
  )
  const exchanges = {
    NTD: useAppSelector(state => state.settings.betterEtoroUIConfig.NTD),
    MYR: useAppSelector(state => state.settings.betterEtoroUIConfig.MYR),
  }

  if (!selected || selected === 'HIDDEN') {
    return null
  }

  const localValues = toCurrency(exchanges[selected].buy * props.USD)

  return (
    <React.Fragment>
      {selected === 'NTD' && (
        <React.Fragment>
          <span className='FooterUnitValue-Main'>{localValues[0]}</span>
          <span className='FooterUnitValue-Currency'>{selected}</span>
        </React.Fragment>
      )}
      {selected === 'MYR' && (
        <React.Fragment>
          <span className='FooterUnitValue-Main'>{localValues[0]}</span>.
          <span className='FooterUnitValue-Small'>{localValues[1]}</span>
          <span className='FooterUnitValue-Currency'>{selected}</span>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

type StickComponent = ReturnType<typeof stickReactComponent>

export let componentsFooterUnitValue: StickComponent[] = []

export const unmountAllFooterUnitValue = async () => {
  const results = componentsFooterUnitValue.map(component =>
    component.unmount(),
  )
  return Promise.all(results).then(() => {
    componentsFooterUnitValue = [] as StickComponent[]
    return componentsFooterUnitValue
  })
}

export const mountAllFooterUnitValues = throttle(async () => {
  const footerUnits = $('et-account-balance .footer-unit')

  const portfolio = angularAPI.$rootScope.session.user.portfolio

  footerUnits.each((index, footerUnit) => {
    const unit = $(footerUnit)

    const id =
      unit.find('.footer-unit-label').html()?.replace(/\s/gi, '') || null

    if (!id) return

    const USD = unit.hasClass('balance')
      ? portfolio.availibleToTrade
      : unit.hasClass('amount')
      ? portfolio.totalInvestedAmount
      : unit.hasClass('profit')
      ? portfolio.totalProfit
      : unit.hasClass('total')
      ? portfolio.equity
      : null

    if (USD) {
      const component = stickReactComponent({
        component: (
          <Provider store={store}>
            <FooterUnitValue USD={USD} />
          </Provider>
        ),
        containerId: `FooterUnitValue-${id}`,
        containerConstructor: container => {
          $(container).addClass('FooterUnitValue-Container')
          unit.find('.footer-unit-value').append(container)
        },
      })

      component.mount()
      componentsFooterUnitValue.push(component)
    }
  })
}, 1000)

mountAllFooterUnitValues['displayName'] = 'mountAllFooterUnitValues'

/**
 * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
 */
GM.addStyle(`
  .footer-unit[_ngcontent-qlo-c4] {
    height: 100px;
  }

  .FooterUnitValue-Container {
    font-size: 12pt;
    margin-left: 4px;
    opacity: 0.65;
  }

  .FooterUnitValue-Main {
    font-weight: bold;
  }

  .FooterUnitValue-Small {
    font-size: 8pt;
  }

  .FooterUnitValue-Currency {
    margin-left: 3px;
    font-size: 8pt;
  }
`)
