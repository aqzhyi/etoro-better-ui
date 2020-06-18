import React from 'react'
import ReactDom from 'react-dom'
import store from '@/store/_store'
import { Provider } from 'react-redux'
import { SearchBox, TextField, TextFieldBase } from '@fluentui/react'
import { i18n } from '@/i18n'
import { debugAPI } from '@/debugAPI'
import { GM } from '@/GM'
import { throttle } from 'lodash'

const ELEMENT_ID = 'portfolio-header-extra-buttons'

const showMeBy = (filterText = '') => {
  if (filterText) {
    $('.ui-table-row').hide()

    $('.table-first-name, .table-last-name').each((index, element) => {
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
    <span id={ELEMENT_ID}>
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
    </span>
  )
}

PortfolioHeaderExtraButtons.hasRendered = () => !!$(`#${ELEMENT_ID}`).length

PortfolioHeaderExtraButtons.getContainer = () => $(`#${ELEMENT_ID}-container`)

PortfolioHeaderExtraButtons.render = () => {
  if (PortfolioHeaderExtraButtons.hasRendered()) {
    return
  }

  const containerLocation = $('.p-portfolio-header .inner-header')

  if (
    containerLocation.length &&
    !PortfolioHeaderExtraButtons.getContainer().length
  ) {
    $(`<span id="${ELEMENT_ID}-container"></span>`).appendTo(containerLocation)
  }

  $(`#${ELEMENT_ID}-container`).length &&
    ReactDom.render(
      <Provider store={store}>
        <PortfolioHeaderExtraButtons />
      </Provider>,
      $(`#${ELEMENT_ID}-container`).html('').get(0),
    )
}

GM.addStyle(`
  #${ELEMENT_ID} {
    display: inline-block;
    margin-left: 16px;
    margin-top: 12px;
  }
`)
