import React from 'react'
import { Icon } from '@fluentui/react'
import { ErrorBoundary } from 'libreact/lib/ErrorBoundary'
import Tooltip from 'rc-tooltip'
import { i18n } from '@/i18n'

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
            overlay={i18n.錯誤程式渲染時發生錯誤(error)}
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
