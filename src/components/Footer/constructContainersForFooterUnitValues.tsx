import { FooterUnitValue } from '~/components/Footer/FooterUnitValue'
import { GM } from '~/GM'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React from 'react'

const CONTAINER_CLASS_NAME = 'FooterUnitValue-Container'

registerReactComponent({
  component: <FooterUnitValue type='availibleToTrade' />,
  containerId: `FooterUnitValue-可用餘額`,
  containerConstructor: container => {
    $(container).addClass(CONTAINER_CLASS_NAME)
    $('.footer-unit.balance .footer-unit-value').append(container)
  },
})

registerReactComponent({
  component: <FooterUnitValue type='totalInvestedAmount' />,
  containerId: `FooterUnitValue-總配額`,
  containerConstructor: container => {
    $(container).addClass(CONTAINER_CLASS_NAME)
    $('.footer-unit.amount .footer-unit-value').append(container)
  },
})

registerReactComponent({
  component: <FooterUnitValue type='totalProfit' />,
  containerId: `FooterUnitValue-利潤`,
  containerConstructor: container => {
    $(container).addClass(CONTAINER_CLASS_NAME)
    $('.footer-unit.profit .footer-unit-value').append(container)
  },
})

registerReactComponent({
  component: <FooterUnitValue type='equity' />,
  containerId: `FooterUnitValue-淨值`,
  containerConstructor: container => {
    $(container).addClass(CONTAINER_CLASS_NAME)
    $('.footer-unit.total .footer-unit-value').append(container)
  },
})

/**
 * 提供 etoro 頁面底部的「可用、配額、利潤、價值」匯率換算
 */
GM.addStyle(`
  .footer-unit[_ngcontent-qlo-c4] {
    height: 100px;
  }

  .${CONTAINER_CLASS_NAME} {
    display: inline-block;
    font-size: 12pt;
    margin-left: 4px;
    opacity: 0.65;
    border-left: 1px solid #b9b9b9;
    padding-left: 4px;
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
