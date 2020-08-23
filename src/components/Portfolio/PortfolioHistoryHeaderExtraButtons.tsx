import { angularAPI } from '@/angularAPI'
import { GM } from '@/GM'
import { usePrimaryTranslation } from '@/hooks/usePrimaryTranslation'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { Stack, TextField, TextFieldBase } from '@fluentui/react'
import { debounce } from 'lodash'
import React from 'react'

export const PortfolioHistoryHeaderExtraButtons = () => {
  const locale = usePrimaryTranslation()
  const searchBoxRef = React.createRef<TextFieldBase>()
  const [filterText, filterTextSet] = React.useState<string | undefined>('')

  return (
    <Stack horizontal horizontalAlign='center'>
      <TextField
        componentRef={searchBoxRef}
        placeholder={locale.t('filterText_input_help')}
        iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
        onChange={debounce((event, newValue) => {
          filterTextSet(newValue)
          angularAPI.filterPortfolioListByText(newValue)
        }, 250)}
        onMouseEnter={() => {
          // setTimeout 避免 polyfills-es5 報錯 Cannot assign to read only property 'event' of object '[object Object]'
          globalThis.setTimeout(() => {
            searchBoxRef.current?.focus()
          })
        }}
      />
    </Stack>
  )
}

export const registeredPortfolioHistoryHeaderExtraButtons = registerReactComponent(
  {
    component: <PortfolioHistoryHeaderExtraButtons />,
    containerId: 'PortfolioHistoryHeaderExtraButtons',
    containerConstructor: container => {
      $(container).insertBefore(
        $('.p-portfolio.history .inner-header .inner-header-buttons'),
      )
    },
  },
)

GM.addStyle(`
  #${registeredPortfolioHistoryHeaderExtraButtons.container.id} {
    display: inline-block;
    margin-left: 16px;
  }
`)
