import React from 'react'
import { Toggle } from '@fluentui/react'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { i18n } from '@/i18n'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { gaAPI, GaEventId } from '@/gaAPI'

export const ExecutionDialogApplyLastOrderSwitch = () => {
  const dispatch = useAppDispatch()
  const executionUseApplyLast = useAppSelector(
    state => state.settings.executionUseApplyLast,
  )

  return (
    <Toggle
      checked={executionUseApplyLast}
      label={
        executionUseApplyLast
          ? i18n.dialog_fixedNextOrderValue_text()
          : i18n.dialog_fixedNextOrderValueNot_text()
      }
      onChange={(event, checked) => {
        gaAPI.sendEvent(
          GaEventId.setting_sameOrderEnabledSet,
          `checked=${String(checked)}`,
        )
        dispatch(
          setBetterEtoroUIConfig({
            executionUseApplyLast: checked,
          }),
        )
      }}
    ></Toggle>
  )
}
