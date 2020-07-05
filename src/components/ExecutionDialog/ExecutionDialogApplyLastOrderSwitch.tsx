import React from 'react'
import { Toggle } from '@fluentui/react'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { i18n } from '@/i18n'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

export const ExecutionDialogApplyLastOrderSwitch = () => {
  const dispatch = useAppDispatch()
  const executionUseApplyLast = useAppSelector(
    state => state.settings.betterEtoroUIConfig.executionUseApplyLast,
  )

  return (
    <Toggle
      checked={executionUseApplyLast}
      label={
        executionUseApplyLast
          ? i18n.使鎖定下單重複一致()
          : i18n.使鎖定下單重複一致否定()
      }
      onChange={(event, checked) => {
        dispatch(
          setBetterEtoroUIConfig({
            executionUseApplyLast: checked,
          }),
        )
      }}
    ></Toggle>
  )
}