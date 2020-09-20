import { Tooltip, TooltipProps, withStyles } from '@material-ui/core'
import React, { memo } from 'react'

const StyledTooltip = withStyles({
  popper: {
    zIndex: 10001,
  },
})(Tooltip)

export const AppTooltip: React.FC<React.PropsWithChildren<{
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
  title: TooltipProps['title']
}>> = memo(function AppTooltip(props) {
  return (
    <StyledTooltip
      arrow
      placement='top'
      enterDelay={0}
      leaveDelay={150}
      {...props.tooltipProps}
      title={props.title}
    >
      <span>{props.children}</span>
    </StyledTooltip>
  )
})
