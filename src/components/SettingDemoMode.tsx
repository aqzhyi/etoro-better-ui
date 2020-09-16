import { Switch } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const SettingDemoMode: React.FC<any> = props => {
  const dispatch = useAppDispatch()
  const isDemo = useAppSelector(state => state.settings.demoMode)

  return (
    <Switch
      defaultChecked={isDemo}
      onChange={(event, checked) => {
        if (checked) {
          $('body').addClass('etoro-better-ui--demo-mode')
        } else {
          $('body').removeClass('etoro-better-ui--demo-mode')
        }

        dispatch(
          setBetterEtoroUIConfig({
            demoMode: checked,
          }),
        )
      }}
    ></Switch>
  )
}
