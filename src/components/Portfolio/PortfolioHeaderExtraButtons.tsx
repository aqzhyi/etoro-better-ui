import { angularAPI } from '~/angularAPI'
import { GM } from '~/GM'
import { usePrimaryTranslation } from '~/hooks/usePrimaryTranslation'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { TextField, TextFieldBase } from '@fluentui/react'
import { debounce } from 'lodash'
import React from 'react'

export const PortfolioHeaderExtraButtons = () => {
  const locale = usePrimaryTranslation()
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export const registeredPortfolioHeaderExtraButtons = registerReactComponent({
  component: <PortfolioHeaderExtraButtons />,
  containerId: 'PortfolioHeaderExtraButtons',
  containerConstructor: container => {
    $(container).appendTo($('.p-portfolio-header .inner-header'))
  },
})

GM.addStyle(`
  #${registeredPortfolioHeaderExtraButtons.container.id} {
    display: inline-block;
    margin-left: 16px;
    margin-top: 12px;
  }
`)
