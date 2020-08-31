import { useState } from 'react'
import { useInterval, useMount } from 'react-use'
import { angularAPI } from '~/angularAPI'

const getModel = () => {
  const _scope = angularAPI.executionDialogScope

  if (!_scope || !_scope.model) {
    return null
  }

  const model = {
    amount: _scope.model.amount.amount,
    lever: _scope.model.leverages.selectedLeverage,
    stopLoss: _scope.model.stopLoss.percentAmount,
    takeProfit: _scope.model.takeProfit.percentAmount,
    instrument: {
      avatar: _scope.model.instrument?.Avatars,
      MinPositionAmount: _scope.model.instrument?.MinPositionAmount,
      InstrumentID: _scope.model.instrument?.InstrumentID,
      Leverages: _scope.model.instrument?.Leverages,
      rate: {
        Ask: _scope.model.instrument?.rate.Ask,
        Bid: _scope.model.instrument?.rate.Bid,
        AskDiscounted: _scope.model.instrument?.rate.AskDiscounted,
        BidDiscounted: _scope.model.instrument?.rate.BidDiscounted,
        LastAsk: _scope.model.instrument?.rate.LastAsk,
        LastBid: _scope.model.instrument?.rate.LastBid,
        lastAskChange: _scope.model.instrument?.rate.lastAskChange,
        lastBidChange: _scope.model.instrument?.rate.lastBidChange,
        lastAskPrice: _scope.model.instrument?.rate.lastAskPrice,
        lastPrice: _scope.model.instrument?.rate.lastPrice,
      },
    },
  }

  return model
}

export const useDialogModel = () => {
  const [model, setModel] = useState<ReturnType<typeof getModel>>()

  useInterval(() => {
    update()
  }, 500)

  const update = () => {
    setModel(getModel())
  }

  return {
    model: model,
    udpate: update,
  }
}
