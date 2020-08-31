import ErrorIcon from '@material-ui/icons/Error'
import { ErrorBoundary, IErrorBoundaryState } from 'libreact/lib/ErrorBoundary'
import React, { createRef, useEffect } from 'react'
import { PrimaryTooltip } from '~/components/PrimaryTooltip'
import { PrimaryTrans } from '~/components/PrimaryTrans'
import { emitter, Events } from '~/emitter'
import { gaAPI, GaEventId } from '~/gaAPI'
import { componentContainerHTMLDataPrefix } from '~/utils/registerReactComponent'

const Icon: React.FC = () => {
  const spanRef = createRef<HTMLSpanElement>()

  /** Re mount the specified component which it's occurring error */
  useEffect(() => {
    if (spanRef.current) {
      const componentName = $(spanRef.current)
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
    <PrimaryTooltip
      tooltipProps={{
        placement: 'bottom',
      }}
      title={JSON.stringify(props.info)}
    >
      <PrimaryTooltip
        title={
          <PrimaryTrans
            i18nKey='universal_errorOnRender_text'
            values={{
              error: props.error,
            }}
          ></PrimaryTrans>
        }
      >
        <Icon />
      </PrimaryTooltip>
    </PrimaryTooltip>
  )
}

export const IconAsErrorBoundary: React.FC = props => {
  return <ErrorBoundary renderError={ErrorBox}>{props.children}</ErrorBoundary>
}
