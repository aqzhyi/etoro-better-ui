import { angularAPI } from '@/angularAPI'
import { FooterUnitValue } from '@/components/Footer/FooterUnitValue'
import { GM } from '@/GM'
import store from '@/store/_store'
import { stickReactComponent } from '@/utils/stickReactComponent'
import React from 'react'
import { Provider } from 'react-redux'

const CONTAINER_CLASS_NAME = 'FooterUnitValue-Container'

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
          $(container).addClass(CONTAINER_CLASS_NAME)
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

  .${CONTAINER_CLASS_NAME} {
    display: inline-block;
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.65;
  }

  @media (max-width:1200px) {
    .${CONTAINER_CLASS_NAME} {
      transform: scale(0.9);
    }
  }

  @media (max-width:1000px) {
    .${CONTAINER_CLASS_NAME} {
      transform: scale(0.8);
    }
  }

  @media (max-width:800px) {
    .${CONTAINER_CLASS_NAME} {
      transform: scale(0.7);
    }
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

  /** Make sure footer values never wrap to multi-lines */
  .footer-unit-value {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 4px;
  }
`)
