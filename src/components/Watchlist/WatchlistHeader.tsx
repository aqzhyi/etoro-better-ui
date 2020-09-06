import { Button, Grid, Hidden, TextField } from '@material-ui/core'
import React from 'react'
import { useDebounce, useMount } from 'react-use'
import { angularAPI } from '~/angularAPI'
import { KeyProbe } from '~/components/KeyProbe'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { WatchlistCompactSwitch } from '~/components/Watchlist/WatchlistCompactSwitch'
import { WatchlistInvestedSwitch } from '~/components/Watchlist/WatchlistInvestedSwitch'
import { gaAPI, GaEventId } from '~/gaAPI'
import { GM } from '~/GM'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import styled from 'styled-components'

const StyledKeyProbe = styled(KeyProbe)`
  position: relative;
`

export const WatchlistHeader: React.FC = () => {
  const listCompactOn = useAppSelector(state => state.settings.listCompactOn)
  const shouldShowInvested = useAppSelector(
    state => state.settings.showInvested,
  )
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<HTMLInputElement>()
  const hotkeyEnabled = useAppSelector(
    state => state.settings.useHotkeys.watchlistFilter,
  )

  useMount(() => {
    angularAPI.toggleListCompact(listCompactOn)
    angularAPI.toggleListInvested(shouldShowInvested)
  })

  useDebounce(
    () => {
      if (filterText) {
        gaAPI.sendEvent(GaEventId.watchlists_filterByText)
      }
    },
    1000,
    [filterText],
  )

  return (
    <Grid container direction='row' spacing={2}>
      <Hidden mdDown>
        <Grid item>
          <Button
            variant='outlined'
            onClick={() => {
              filterTextSet('')
              angularAPI.filterWatchlistByText('')
              angularAPI.toggleListInvested(shouldShowInvested)
              gaAPI.sendEvent(GaEventId.watchlists_filterByTextClearClick)
            }}
          >
            <PrimaryTrans i18nKey='filterText_clearText_text'></PrimaryTrans>
          </Button>
        </Grid>
      </Hidden>

      <Grid item>
        <PrimaryTooltip
          tooltipProps={{ placement: 'bottom' }}
          title={<PrimaryTrans i18nKey='filterText_input_brief'></PrimaryTrans>}
        >
          <TextField
            size='small'
            style={{ width: 120 }}
            label={
              <PrimaryTrans i18nKey='filterText_input_help'></PrimaryTrans>
            }
            InputProps={{
              endAdornment: (
                <StyledKeyProbe
                  filter='F'
                  command={ownProps => {
                    if (!hotkeyEnabled) return
                    if (!searchBoxRef.current) return

                    // do nothing if target is handling by another global target
                    if (ownProps.keyTarget) return

                    // do nothing if target is handling by used in trade dialog
                    if (angularAPI.$rootScope?.layoutCtrl.uiDialog.isDialogOpen)
                      return

                    const targetElement = $(searchBoxRef.current)

                    if (targetElement.is(':focus')) return

                    gaAPI.sendEvent(GaEventId.keyboard_filterTextFocus)
                    targetElement.trigger('focus')
                  }}
                ></StyledKeyProbe>
              ),
            }}
            variant='outlined'
            value={filterText}
            onChange={event => {
              const newValue = event.target.value || ''
              filterTextSet(newValue)
              angularAPI.filterWatchlistByText(newValue)

              if (!newValue) {
                angularAPI.toggleListInvested(shouldShowInvested)
              }
            }}
            onKeyDown={event => {
              if (event.key.toLowerCase() === 'escape') {
                gaAPI.sendEvent(GaEventId.watchlists_filterByTextEscapeKeyClick)
                filterTextSet('')
                angularAPI.filterWatchlistByText('')
                angularAPI.toggleListInvested(shouldShowInvested)
                searchBoxRef.current && $(searchBoxRef.current).trigger('blur')
              }

              if (event.key.toLowerCase() === 'enter') {
                gaAPI.sendEvent(GaEventId.watchlists_filterByTextEnterKeyClick)
                angularAPI.openTradeDialog()
                searchBoxRef.current && $(searchBoxRef.current).trigger('blur')
              }
            }}
            inputRef={searchBoxRef}
          ></TextField>
        </PrimaryTooltip>
      </Grid>

      <Grid item>
        <PrimaryTooltip
          tooltipProps={{ placement: 'bottom' }}
          title={
            <PrimaryTrans i18nKey='universal_compact_brief'></PrimaryTrans>
          }
        >
          <div>
            <WatchlistCompactSwitch />
          </div>
        </PrimaryTooltip>
      </Grid>

      <Grid item>
        <PrimaryTooltip
          tooltipProps={{ placement: 'bottom' }}
          title={<PrimaryTrans i18nKey='profits_invested_brief'></PrimaryTrans>}
        >
          <div>
            <WatchlistInvestedSwitch />
          </div>
        </PrimaryTooltip>
      </Grid>
    </Grid>
  )
}

export const registeredWatchlistHeader = registerReactComponent({
  component: <WatchlistHeader></WatchlistHeader>,
  containerId: WatchlistHeader.name,
  containerConstructor: containerElement => {
    $('.watchlist-header .watch-list-buttons').prepend(containerElement)
  },
})

GM.addStyle(`
  #${registeredWatchlistHeader.container.id} {
    margin-top: 18px;
  }
`)
