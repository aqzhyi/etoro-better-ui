import React from 'react'
import ReactDom from 'react-dom'
import store from '@/store/_store'
import { Provider } from 'react-redux'
import { SearchBox, TextField } from '@fluentui/react'
import { i18n } from '@/i18n'
import { debugAPI } from '@/debugAPI'
import { GM } from '@/GM'
import { throttle } from 'lodash'

const ELEMENT_ID = 'portfolio-header-extra-buttons'

const showMyBy = (filterText = '') => {
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
  const [filterText, setFilterText] = React.useState<string | undefined>('')

  return (
    <span id={ELEMENT_ID}>
      <TextField
        placeholder={i18n.輸入以過濾()}
        iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
        onChange={(event, newValue) => {
          setFilterText(newValue)
          showMyBy(newValue)
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
  }
`)
