import ErrorIcon from '@material-ui/icons/Error'
import { ErrorBoundary, IErrorBoundaryState } from 'libreact/lib/ErrorBoundary'
import { throttle } from 'lodash'
import React, { createRef, useEffect } from 'react'
import { AppTooltip } from '~/components/AppTooltip'
import { AppTrans } from '~/components/AppTrans'
import { emitter, Events } from '~/emitter'
import { gaAPI, GaEventId } from '~/gaAPI'
import { componentContainerHTMLDataPrefix } from '~/utils/registerReactComponent'

const mountCrashComponentThrottle = throttle((element: HTMLSpanElement) => {
  const componentName = $(element)
    .closest(`[${componentContainerHTMLDataPrefix}]`)
    .attr(componentContainerHTMLDataPrefix)

  if (componentName) {
    emitter.emit(Events.onUnmountUIs, { components: [componentName] })
    gaAPI.sendEvent(
      GaEventId.alert_componentCrash,
      `component=${componentName}`,
    )
  } else {
    emitter.emit(Events.onUnmountUIs)
    gaAPI.sendEvent(GaEventId.alert_componentCrash, `component=_UNKNOWN_`)
  }
}, 3000)

const Icon: React.FC = () => {
  const spanRef = createRef<HTMLSpanElement>()

  /** Re mount the specified component which it's occurring error */
  useEffect(() => {
    if (spanRef.current) {
      mountCrashComponentThrottle(spanRef.current)
    }
  }, [spanRef])

  return (
    <span ref={spanRef}>
      <ErrorIcon />
    </span>
  )
}

const ErrorBox: React.FC<IErrorBoundaryState> = props => {
  return (
    <AppTooltip
      tooltipProps={{
        placement: 'bottom',
      }}
      title={JSON.stringify(props.info)}
    >
      <AppTooltip
        title={
          <AppTrans
            i18nKey='universal_errorOnRender_text'
            values={{
              error: props.error,
            }}
          ></AppTrans>
        }
      >
        <Icon />
      </AppTooltip>
    </AppTooltip>
  )
}

export const IconAsErrorBoundary: React.FC = props => {
  return <ErrorBoundary renderError={ErrorBox}>{props.children}</ErrorBoundary>
}
