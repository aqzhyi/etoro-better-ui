import React, { Fragment } from 'react'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { PingProbeHidden } from '~/components/PingProbeHidden'
import { TradingStatusProbeHidden } from '~/components/TradingStatusProbeHidden'
import { Hidden } from '@material-ui/core'

export const App: React.FC = props => {
  return (
    <Fragment>
      <Fragment>
        <PingProbeHidden />
        <TradingStatusProbeHidden />
      </Fragment>
    </Fragment>
  )
}

registerReactComponent({
  component: (
    <Hidden>
      <App />
    </Hidden>
  ),
  containerId: App.name,
  containerConstructor: containerElement => {
    $(`.i-menu-user-info`).append(containerElement)
  },
})
