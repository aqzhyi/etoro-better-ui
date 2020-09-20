import {
  FormControlLabel,
  FormControlLabelProps,
  Switch,
} from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { HelpIcon } from '~/components/HelpIcon'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const ExecutionDialogFixedAmountLeverToggle: React.FC<{
  labelPlacement?: FormControlLabelProps['labelPlacement']
}> = props => {
  const dispatch = useAppDispatch()
  const executionUseApplyLast = useAppSelector(
    state => state.settings.executionUseApplyLast,
  )

  return (
    <React.Fragment>
      <AppTooltip
        tooltipProps={{ placement: 'right' }}
        title={
          <span style={{ display: 'inline-block', width: 200 }}>
            <AppTrans i18nKey='dialog_fixedNextOrderValue_brief'></AppTrans>
          </span>
        }
      >
        <span style={{ display: 'inline-block' }}>
          <FormControlLabel
            label={
              <React.Fragment>
                {executionUseApplyLast ? (
                  <AppTrans i18nKey='dialog_fixedNextOrderValue_text'></AppTrans>
                ) : (
                  <AppTrans i18nKey='dialog_fixedNextOrderValueNot_text'></AppTrans>
                )}

                <HelpIcon
                  notionHref={
                    'https://www.notion.so/hilezi/Fixes-value-of-leverage-and-amount-on-Trade-Execution-Dialog-window-5654a6c6140e4196b44effc525ef79e0'
                  }
                ></HelpIcon>
              </React.Fragment>
            }
            labelPlacement={props.labelPlacement}
            control={
              <Switch
                defaultChecked={executionUseApplyLast}
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
              ></Switch>
            }
          ></FormControlLabel>
        </span>
      </AppTooltip>
    </React.Fragment>
  )
}
