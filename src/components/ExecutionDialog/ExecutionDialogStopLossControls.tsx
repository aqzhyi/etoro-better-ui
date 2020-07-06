import React, { useEffect } from 'react'
import { stickReactComponent } from '@/utils/stickReactComponent'
import store, { useAppDispatch, useAppSelector } from '@/store/_store'
import { Provider } from 'react-redux'
import { GM } from '@/GM'
import Tooltip from 'rc-tooltip'
import { i18n } from '@/i18n'
import { Icon } from '@fluentui/react'
import { debounce } from 'lodash'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { angularAPI } from '@/angularAPI'
import { useMount } from 'react-use'

const ExecutionDialogStopLossControls = () => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state =>
      state.settings.betterEtoroUIConfig.stopLossAndTakeProfitUseLastPercent,
  )

  if (!enabled) {
    return null
  }

  const lastPercent = useAppSelector(
    state => state.settings.betterEtoroUIConfig.stopLossLastPercent,
  )

  // recording your last percent on input which number you key in
  useEffect(() => {
    $('body').delegate(
      '[data-etoro-automation-id="execution-stop-loss-amount-input"] input',
      `blur.${ExecutionDialogStopLossControls.name}`,
      debounce(event => {
        dispatch(
          setBetterEtoroUIConfig({
            stopLossLastPercent:
              angularAPI.executionDialogScope?.model.stopLoss.percentAmount,
          }),
        )
      }, 500),
    )

    return () => {
      $('body').undelegate(`blur.${ExecutionDialogStopLossControls.name}`)
    }
  }, [])

  useMount(() => {
    angularAPI.setDialogStopLoss(lastPercent)
  })

  return (
    <Tooltip
      placement='top'
      overlay={i18n.下單框套用上次止損趴數之說明(lastPercent)}
    >
      <Icon
        iconName='DatabaseSync'
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          angularAPI.setDialogStopLoss(lastPercent)
        }}
      />
    </Tooltip>
  )
}

export const {
  mount: mountExecutionDialogStopLossControls,
  unmount: unmountExecutionDialogStopLossControls,
  containerId: ExecutionDialogStopLossControlsId,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <ExecutionDialogStopLossControls />
    </Provider>
  ),
  containerId: ExecutionDialogStopLossControls.name,
  containerConstructor: containerElement => {
    $('tabtitle').eq(0).append(containerElement)
  },
})

GM.addStyle(`
  tabtitle:nth-of-type(1) {
    position: relative;
  }

  #${ExecutionDialogStopLossControlsId} {
    position: absolute;
    width: auto;
    display: flex;
    top: 25px;
    justify-content: flex-end;
    right: 20px;
  }
`)
