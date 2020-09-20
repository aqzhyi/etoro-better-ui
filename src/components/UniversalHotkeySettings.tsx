import { FormControlLabel, Grid, Switch } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { AppTrans } from '~/components/AppTrans'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const UniversalHotkeySettings: React.FC = props => {
  const dispatch = useAppDispatch()
  const hotkeys = useAppSelector(state => state.settings.useHotkeys)

  return (
    <React.Fragment>
      <Grid container direction='column'>
        <Grid item>
          <FormControlLabel
            label={
              <AppTrans i18nKey='universal_useKeyboardHotkeys_12345_brief'></AppTrans>
            }
            control={
              <Switch
                checked={hotkeys?.key12345 === true}
                onChange={(event, checked) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      useHotkeys: {
                        ...hotkeys,
                        key12345: checked,
                      },
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </Grid>

        <Grid item>
          <FormControlLabel
            label={
              <AppTrans i18nKey='universal_useKeyboardHotkeys_tab_brief'></AppTrans>
            }
            control={
              <Switch
                checked={hotkeys?.dialogBuySellSwitch === 'Tab'}
                onChange={(event, checked) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      useHotkeys: {
                        ...hotkeys,
                        dialogBuySellSwitch: checked ? 'Tab' : null,
                      },
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </Grid>

        <Grid item>
          <FormControlLabel
            label={
              <AppTrans i18nKey='universal_useKeyboardHotkeys_esc_brief'></AppTrans>
            }
            control={
              <Switch
                checked={hotkeys?.dialogClose === 'Esc'}
                onChange={(event, enabled) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      useHotkeys: {
                        ...hotkeys,
                        dialogClose: enabled ? 'Esc' : null,
                      },
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </Grid>

        <Grid item>
          <FormControlLabel
            label={
              <AppTrans i18nKey='universal_useKeyboardHotkeys_space_brief'></AppTrans>
            }
            control={
              <Switch
                checked={hotkeys?.dialogOpenTrade === ' '}
                onChange={(event, enabled) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      useHotkeys: {
                        ...hotkeys,
                        dialogOpenTrade: enabled ? ' ' : null,
                      },
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </Grid>

        <Grid item>
          <FormControlLabel
            label={
              <AppTrans i18nKey='universal_useKeyboardHotkeys_f_brief'></AppTrans>
            }
            control={
              <Switch
                checked={hotkeys?.watchlistFilter === 'F'}
                onChange={(event, enabled) => {
                  dispatch(
                    setBetterEtoroUIConfig({
                      useHotkeys: {
                        ...hotkeys,
                        watchlistFilter: enabled ? 'F' : null,
                      },
                    }),
                  )
                }}
              ></Switch>
            }
          ></FormControlLabel>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
