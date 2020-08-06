import { angularAPI } from '@/angularAPI'
import { ProfitText } from '@/components/ProfitText'
import { emitter, Events } from '@/emitter'
import { GM } from '@/GM'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React, { useState } from 'react'
import { useInterval } from 'react-use'

export const ExecutionDialogBuySellPrice: React.FC<{
  priceGetter: 'buy' | 'sell'
}> = props => {
  const [price, priceSetter] = useState(0)

  useInterval(() => {
    if (props.priceGetter === 'buy') {
      priceSetter(
        () =>
          angularAPI.executionDialogScope?.model.instrument?.rate
            .lastAskPrice ?? 0,
      )
    } else if (props.priceGetter === 'sell') {
      priceSetter(
        () =>
          angularAPI.executionDialogScope?.model.instrument?.rate.lastPrice ??
          0,
      )
    }
  }, 50)

  return <ProfitText profit={price} pureDollar noDollarSign />
}

const buyComponent = registerReactComponent({
  component: <ExecutionDialogBuySellPrice priceGetter='buy' />,
  containerId: `${ExecutionDialogBuySellPrice.name}Buy`,
  containerClassName: ExecutionDialogBuySellPrice.name,
  containerConstructor: renderContainer => {
    $(angularAPI.selectors.dialogBuyButton).append(renderContainer)
  },
})

const sellComponent = registerReactComponent({
  component: <ExecutionDialogBuySellPrice priceGetter='sell' />,
  containerId: `${ExecutionDialogBuySellPrice.name}Sell`,
  containerClassName: ExecutionDialogBuySellPrice.name,
  containerConstructor: renderContainer => {
    $(angularAPI.selectors.dialogSellButton).append(renderContainer)
  },
})

emitter.on(Events.onDialogHover, buyComponent.mount)
emitter.on(Events.onDialogNotFount, buyComponent.unmount)

emitter.on(Events.onDialogHover, sellComponent.mount)
emitter.on(Events.onDialogNotFount, sellComponent.unmount)

GM.addStyle(`
  .${ExecutionDialogBuySellPrice.name} {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    transform: translateY(23px);
    text-shadow: 1px 1px 1px #000000;
    font-size: 22px;
  }
`)
