import { angularAPI } from '@/angularAPI'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { registerReactComponent } from '@/utils/registerReactComponent'
import { TextField, TextFieldBase } from '@fluentui/react'
import React from 'react'
import { debounce } from 'lodash'

export const PortfolioHeaderExtraButtons = () => {
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  return (
    <React.Fragment>
      <TextField
        componentRef={searchBoxRef}
        placeholder={i18n.輸入以過濾()}
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
