import { angularAPI } from '@/angularAPI'
import { FooterUnitValue } from '@/components/Footer/FooterUnitValue'
import { GM } from '@/GM'
import store from '@/store/_store'
import { stickReactComponent } from '@/utils/stickReactComponent'
import React from 'react'
import { Provider } from 'react-redux'

export const constructContainersForFooterUnitValues = () => {
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
    }
  })
}

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
