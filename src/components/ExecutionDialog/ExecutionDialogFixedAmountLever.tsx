import React from 'react'
import { Label, Toggle } from '@fluentui/react'
import { useAppDispatch, useAppSelector } from '@/store/_store'
import { i18n } from '@/i18n'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { gaAPI, GaEventId } from '@/gaAPI'
import Tooltip from 'rc-tooltip'
import { HelpIcon } from '@/components/HelpIcon'

export const ExecutionDialogFixedAmountLever = () => {
  const dispatch = useAppDispatch()
  const executionUseApplyLast = useAppSelector(
    state => state.settings.executionUseApplyLast,
  )

  return (
    <React.Fragment>
      <Tooltip
        placement='left'
        overlay={
          <span style={{ display: 'inline-block', width: 200 }}>
            {i18n.dialog_fixedNextOrderValue_brief()}
          </span>
        }
      >
        <span style={{ display: 'inline-block' }}>
          <Label>
            {executionUseApplyLast
              ? i18n.dialog_fixedNextOrderValue_text()
              : i18n.dialog_fixedNextOrderValueNot_text()}

            <HelpIcon
              notionHref={
                'https://www.notion.so/hilezi/Fixes-value-of-leverage-and-amount-on-Trade-Execution-Dialog-window-5654a6c6140e4196b44effc525ef79e0'
              }
            ></HelpIcon>
          </Label>
          <Toggle
            checked={executionUseApplyLast}
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
        </span>
      </Tooltip>
    </React.Fragment>
  )
}
