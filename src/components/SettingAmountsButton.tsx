import { Button } from '@material-ui/core'
import React from 'react'
import { openPromptForSetMacroAmount } from '~/actions/setMacroAmount'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppDispatch } from '~/store/_store'

/**
 * Set up the amounts buttons which in Native Trade Dialog by click button
 */
export const SettingAmountsButton: React.FC = props => {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant='outlined'
      color='primary'
      size='small'
      fullWidth
      onClick={() => {
        gaAPI.sendEvent(GaEventId.dialog_buttonsArrangeClick)
        dispatch(openPromptForSetMacroAmount())
      }}
    >
      <PrimaryTrans i18nKey='common_buttonSetup'></PrimaryTrans>
    </Button>
  )
}
