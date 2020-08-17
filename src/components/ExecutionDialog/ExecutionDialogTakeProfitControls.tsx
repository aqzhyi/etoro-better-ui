import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { angularAPI } from '@/angularAPI'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { storage } from '@/storage'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { Icon } from '@fluentui/react'
import { debounce } from 'lodash'
import Tooltip from 'rc-tooltip'
import React, { useEffect } from 'react'
import { useMount } from 'react-use'

export const ExecutionDialogTakeProfitControls = () => {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(
    state => state.settings.stopLossAndTakeProfitUseLastPercent,
  )

  const lastPercent = useAppSelector(
    state => state.settings.takeProfitLastPercent,
  )

  // recording your last percent on input which number you key in
  useEffect(() => {
    $('body').on(
      `blur.${ExecutionDialogTakeProfitControls.name}`,
      '[data-etoro-automation-id="execution-take-profit-amount-input"] input',
      debounce(event => {
        dispatch(
          setBetterEtoroUIConfig({
            takeProfitLastPercent:
              angularAPI.executionDialogScope?.model?.takeProfit.percentAmount,
          }),
        )
      }, 500),
    )

    return () => {
      $('body').off(`blur.${ExecutionDialogTakeProfitControls.name}`)
    }
  }, [dispatch])

  useMount(() => {
    angularAPI.setDialogTakeProfit(lastPercent)
  })

  if (!enabled) {
    return null
  }

  return (
    <Tooltip
      placement='top'
      overlay={
        <span>{i18n.profits_fixedTakeValueOnOrder_brief(lastPercent)}</span>
      }
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

export const registeredExecutionDialogTakeProfitControls = registerReactComponent(
  {
    component: <ExecutionDialogTakeProfitControls />,
    containerId: ExecutionDialogTakeProfitControls.name,
    containerConstructor: containerElement => {
      $('tabtitle').eq(2).append(containerElement)
    },
    disabled: () => {
      if (!storage.findConfig().executionMacroEnabledInProchart) return true
      return false
    },
  },
)

GM.addStyle(`
  tabtitle:nth-of-type(3) {
    position: relative;
  }

  #${registeredExecutionDialogTakeProfitControls.container.id} {
    position: absolute;
    width: auto;
    display: flex;
    top: 25px;
    justify-content: flex-end;
    right: 20px;
  }
`)
