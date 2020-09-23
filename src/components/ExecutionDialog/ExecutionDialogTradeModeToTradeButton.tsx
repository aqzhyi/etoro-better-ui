import { Button } from '@material-ui/core'
import React from 'react'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { KeyProbe } from '~/components/KeyProbe'

export const ExecutionDialogTradeModeToTradeButton: React.FC<any> = props => {
  return (
    <Button
      variant='outlined'
      onClick={() => {
        angularAPI.setTradeModeToTrade()
      }}
    >
      <AppTrans i18nKey='dialog_setModeToTrade_text'></AppTrans>

      <KeyProbe
        filter='T'
        command={() => {
          angularAPI.setTradeModeToTrade()
        }}
      ></KeyProbe>
    </Button>
  )
}
