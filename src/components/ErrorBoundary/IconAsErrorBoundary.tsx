import ErrorIcon from '@material-ui/icons/Error'
import { ErrorBoundary } from 'libreact/lib/ErrorBoundary'
import React from 'react'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { emitter, Events } from '~/emitter'

export const IconAsErrorBoundary: React.FC = props => {
  return (
    <ErrorBoundary
      renderError={({ error, info }) => {
        console.warn(error.message, info.componentStack)

        emitter.emit(Events.onUnmountUIs)
        globalThis.setTimeout(() => {
          emitter.emit(Events.onMountUIs)
        }, 500)

        return (
          <PrimaryTooltip
            tooltipProps={{
              placement: 'bottom',
            }}
            title={JSON.stringify(info)}
          >
            <PrimaryTooltip
              title={
                <PrimaryTrans
                  i18nKey='universal_errorOnRender_text'
                  values={{
                    error,
                  }}
                ></PrimaryTrans>
              }
            >
              <ErrorIcon />
            </PrimaryTooltip>
          </PrimaryTooltip>
        )
      }}
    >
      {props.children}
    </ErrorBoundary>
  )
}
