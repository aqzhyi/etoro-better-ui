import { angularAPI } from '@/angularAPI'
import { GM } from '@/GM'
import store, { useAppSelector, useAppDispatch } from '@/store/_store'
import { stickReactComponent } from '@/utils/stickReactComponent'
import { Icon } from '@fluentui/react'
import Tooltip from 'rc-tooltip'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useMount } from 'react-use'
import { i18n } from '@/i18n'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { debounce } from 'lodash'

export const ExecutionDialogTakeProfitControls = () => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state =>
      state.settings.betterEtoroUIConfig.stopLossAndTakeProfitUseLastPercent,
  )

  if (!enabled) {
    return null
  }

  const lastPercent = useAppSelector(
    state => state.settings.betterEtoroUIConfig.takeProfitLastPercent,
  )

  // recording your last percent on input which number you key in
  useEffect(() => {
    $('body').delegate(
      '[data-etoro-automation-id="execution-take-profit-amount-input"] input',
      `blur.${ExecutionDialogTakeProfitControls.name}`,
      debounce(event => {
        dispatch(
          setBetterEtoroUIConfig({
            takeProfitLastPercent:
              angularAPI.executionDialogScope?.model.takeProfit.percentAmount,
          }),
        )
      }, 500),
    )

    return () => {
      $('body').undelegate(`blur.${ExecutionDialogTakeProfitControls.name}`)
    }
  }, [])

  useMount(() => {
    angularAPI.setDialogTakeProfit(lastPercent)
  })

  return (
    <Tooltip
      placement='top'
      overlay={<span>{i18n.下單框套用上次止盈趴數之說明(lastPercent)}</span>}
    >
      <Icon
        iconName='DatabaseSync'
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          angularAPI.setDialogTakeProfit(lastPercent)
        }}
      />
    </Tooltip>
  )
}

export const {
  mount: mountExecutionDialogTakeProfitControls,
  unmount: unmountExecutionDialogTakeProfitControls,
  containerId: mountExecutionDialogTakeProfitControlsID,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <ExecutionDialogTakeProfitControls />
    </Provider>
  ),
  containerId: ExecutionDialogTakeProfitControls.name,
  containerConstructor: containerElement => {
    $('tabtitle').eq(2).append(containerElement)
  },
})

GM.addStyle(`
  tabtitle:nth-of-type(3) {
    position: relative;
  }

  #${mountExecutionDialogTakeProfitControlsID} {
    position: absolute;
    width: auto;
    display: flex;
    top: 25px;
    justify-content: flex-end;
    right: 20px;
  }
`)
