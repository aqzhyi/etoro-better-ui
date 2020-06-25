import React from 'react'
import ReactDom from 'react-dom'
import store from '@/store/_store'
import { Provider } from 'react-redux'
import { SearchBox, TextField, TextFieldBase } from '@fluentui/react'
import { i18n } from '@/i18n'
import { debugAPI } from '@/debugAPI'
import { GM } from '@/GM'
import { stickReactComponent } from '@/utils/stickReactComponent'

const showMeBy = (filterText = '') => {
  if (filterText) {
    $('.ui-table-row').hide()

    $(
      '.table-first-name, .table-last-name, .i-portfolio-table-name-symbol',
    ).each((index, element) => {
      const didMatch = element.innerHTML
        .trim()
        .toLowerCase()
        .includes(filterText.toLowerCase().trim())

      if (didMatch) {
        $(element).closest('.ui-table-row').show()
      }
    })
  } else {
    $('.ui-table-row').show()
  }
}

export const PortfolioHeaderExtraButtons = () => {
  const [filterText, filterTextSet] = React.useState<string | undefined>('')
  const searchBoxRef = React.createRef<TextFieldBase>()

  return (
    <React.Fragment>
      <TextField
        componentRef={searchBoxRef}
        placeholder={i18n.輸入以過濾()}
        iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
        onChange={(event, newValue) => {
          filterTextSet(newValue)
          showMeBy(newValue)
        }}
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

export const {
  mount: mountPortfolioHeaderExtraButtons,
  unmount: unmountPortfolioHeaderExtraButtons,
  containerId: PortfolioHeaderExtraButtonsId,
} = stickReactComponent({
  component: (
    <Provider store={store}>
      <PortfolioHeaderExtraButtons />
    </Provider>
  ),
  containerId: 'PortfolioHeaderExtraButtons',
  containerConstructor: container => {
    $(container).appendTo($('.p-portfolio-header .inner-header'))
  },
})

GM.addStyle(`
  #${PortfolioHeaderExtraButtonsId} {
    display: inline-block;
    margin-left: 16px;
    margin-top: 12px;
  }
`)
