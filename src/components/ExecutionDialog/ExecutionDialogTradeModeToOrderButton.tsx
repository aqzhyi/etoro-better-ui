import { Button } from '@material-ui/core'
import React from 'react'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { KeyProbe } from '~/components/KeyProbe'

export const ExecutionDialogTradeModeToOrderButton: React.FC<any> = props => {
  return (
    <Button
      variant='outlined'
      onClick={() => {
        angularAPI.setTradeModeToOrder()
      }}
    >
      <AppTrans i18nKey='dialog_setModeToOrder_text'></AppTrans>

      <KeyProbe
        filter='F'
        command={() => {
          angularAPI.setTradeModeToOrder()
        }}
      ></KeyProbe>
    </Button>
  )
}
