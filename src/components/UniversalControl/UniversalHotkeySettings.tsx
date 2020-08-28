import { FormControlLabel, Grid, Switch } from '@material-ui/core'
import React from 'react'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const UniversalHotkeySettings: React.FC = props => {
  const dispatch = useAppDispatch()
  const hotkeys = useAppSelector(state => state.settings.useHotkeys)

  return (
    <React.Fragment>
      <Grid container direction='row'>
        <Grid container item>
          <FormControlLabel
            label={
              <PrimaryTrans i18nKey='universal_useKeyboardHotkeys_tab_brief'></PrimaryTrans>
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

        <Grid container item>
          <FormControlLabel
            label={
              <PrimaryTrans i18nKey='universal_useKeyboardHotkeys_esc_brief'></PrimaryTrans>
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

        <Grid container item>
          <FormControlLabel
            label={
              <PrimaryTrans i18nKey='universal_useKeyboardHotkeys_space_brief'></PrimaryTrans>
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

        <Grid container item>
          <FormControlLabel
            label={
              <PrimaryTrans i18nKey='universal_useKeyboardHotkeys_f_brief'></PrimaryTrans>
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
