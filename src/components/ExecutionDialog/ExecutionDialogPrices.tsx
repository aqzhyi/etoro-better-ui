import { angularAPI } from '@/angularAPI'
import { isDisabledInProchart } from '@/components/ExecutionDialog/isDisabledInProchart'
import { ProfitText } from '@/components/ProfitText'
import { emitter, Events } from '@/emitter'
import { GM } from '@/GM'
import { useRate } from '@/hooks/useRate'
import { useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import React, { useMemo } from 'react'
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
  const rate = useRate()

  const degree = useAppSelector(state => state.settings.inviteExcitingDegree)

  const askValue = useMemo(() => {
    if (rate.model?.isLowLeverage) {
      return rate.value?.AskDiscounted ?? 0
    }

    return rate.value?.lastAskPrice ?? 0
  }, [rate])

  useInterval(() => {
    rate.updateValue()
  }, degree)

  if (!rate.value || !degree) {
    return null
  }

  return (
    <React.Fragment>
      <span
        className={`${withBlock(Blocks.price)} ${withBlock(Blocks.priceBid)}`}
      >
        <ProfitText profit={rate.value.lastPrice} pureDollar noDollarSign />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          {<ProfitText profit={rate.value.lastBidChange} noDollarSign />}
        </span> */}
      </span>

      <span
        className={`${withBlock(Blocks.price)} ${withBlock(Blocks.priceAsk)}`}
      >
        <ProfitText profit={askValue} pureDollar noDollarSign />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          <ProfitText profit={rate.value.lastAskChange} noDollarSign />
        </span> */}
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
  disabled: () => {
    if (isDisabledInProchart()) return true
    return false
  },
})

emitter.on(Events.onDialogHover, exectionDialogPrices.mount)
emitter.on(Events.onDialogNotFound, exectionDialogPrices.unmount)

GM.addStyle(`
  @media (min-width:741px) {
    [id^=uidialog] .${withBlock(Blocks.price)} {
      position: absolute;
      text-shadow: 1px 1px 1px #000000;
      font-size: 22px;
    }

    [id^=uidialog] .${withBlock(Blocks.priceBid)} {
      left: 167px;
      top: 14%;
    }

    [id^=uidialog] .${withBlock(Blocks.priceAsk)} {
      left: 362px;
      top: 14%;
    }

    [id^=uidialog] .${withBlock(Blocks.priceMovement)} {
      font-size: 0.8em;
      margin-left: 8px;
    }

    [id^=uidialog] #${withBlock(Blocks.root)} {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  }
`)
