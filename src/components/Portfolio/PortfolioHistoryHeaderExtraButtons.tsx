import React from 'react'
import { Stack, TextField, TextFieldBase } from '@fluentui/react'
import { GM } from '@/GM'
import { debounce } from 'lodash'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { angularAPI } from '@/angularAPI'
import { useTranslation } from 'react-i18next'

export const PortfolioHistoryHeaderExtraButtons = () => {
  const locale = useTranslation()
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
