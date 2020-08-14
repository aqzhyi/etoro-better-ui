import { angularAPI } from '@/angularAPI'
import { ProfitText } from '@/components/ProfitText'
import { emitter, Events } from '@/emitter'
import { GM } from '@/GM'
import { useExecutionDialogScope } from '@/hooks/useExecutionDialogScope'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React from 'react'
import { useInterval } from 'react-use'

enum Blocks {
  root,
  price,
  priceAsk,
  priceBid,
  priceMovement,
}

const withBlock = (blackName: Blocks) =>
  `hilezir-${ExecutionDialogPrices.name}__${Blocks[blackName]}`

const ExecutionDialogPrices: React.FC = () => {
  const dialog = useExecutionDialogScope()

  useInterval(() => {
    dialog.rate.update()
  }, 50)

  if (!dialog.rate.value) {
    return null
  }

  return (
    <React.Fragment>
      <span
        className={`${withBlock(Blocks.price)} ${withBlock(Blocks.priceBid)}`}
      >
        <ProfitText profit={dialog.rate.value.Bid} pureDollar noDollarSign />
        <span className={withBlock(Blocks.priceMovement)}>
          <ProfitText
            profit={dialog.rate.value.Bid - dialog.rate.value.LastBid}
            noDollarSign
          />
        </span>
      </span>
      <span
        className={`${withBlock(Blocks.price)} ${withBlock(Blocks.priceAsk)}`}
      >
        <ProfitText profit={dialog.rate.value.Ask} pureDollar noDollarSign />
        <span className={withBlock(Blocks.priceMovement)}>
          <ProfitText
            profit={dialog.rate.value.Ask - dialog.rate.value.LastAsk}
            noDollarSign
          />
        </span>
      </span>
    </React.Fragment>
  )
}

export const exectionDialogPrices = registerReactComponent({
  component: <ExecutionDialogPrices />,
  containerId: withBlock(Blocks.root),
  containerConstructor: renderContainer => {
    $(angularAPI.selectors.dialogInnerContent).append(renderContainer)
  },
})

emitter.on(Events.onDialogHover, exectionDialogPrices.mount)
emitter.on(Events.onDialogNotFound, exectionDialogPrices.unmount)

GM.addStyle(`
  @media (min-width:741px) {
    .${withBlock(Blocks.price)} {
      position: absolute;
      text-shadow: 1px 1px 1px #000000;
      font-size: 22px;
    }

    .${withBlock(Blocks.priceBid)} {
      left: 167px;
      top: 14%;
    }

    .${withBlock(Blocks.priceAsk)} {
      left: 362px;
      top: 14%;
    }

    .${withBlock(Blocks.priceMovement)} {
      font-size: 0.8em;
      margin-left: 8px;
    }

    #${withBlock(Blocks.root)} {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  }
`)
