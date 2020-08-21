import React from 'react'
import { Icon } from '@fluentui/react'
import { ErrorBoundary } from 'libreact/lib/ErrorBoundary'
import Tooltip from 'rc-tooltip'
import { PrimaryTrans } from '@/components/PrimaryTrans'

export const IconAsErrorBoundary: React.FC = props => {
  return (
    <ErrorBoundary
      renderError={({ error, info }) => (
        <Tooltip
          placement='bottom'
          overlay={JSON.stringify(info)}
          overlayInnerStyle={{ width: 250 }}
        >
          <Tooltip
            placement='top'
            overlay={
              <PrimaryTrans
                i18nKey='universal_errorOnRender_text'
                values={{
                  error,
                }}
              ></PrimaryTrans>
            }
            overlayInnerStyle={{ width: 250 }}
          >
            <Icon iconName='WarningSolid'></Icon>
          </Tooltip>
        </Tooltip>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}
