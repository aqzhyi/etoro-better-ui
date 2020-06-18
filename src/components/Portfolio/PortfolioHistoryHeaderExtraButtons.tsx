import React from 'react'
import ReactDOM from 'react-dom'
import store from '@/store/_store'
import { Provider } from 'react-redux'
import { Stack, TextField, TextFieldBase } from '@fluentui/react'
import { GM } from '@/GM'
import { i18n } from '@/i18n'
import { debounce } from 'lodash'

const ELEMENT_ID = 'portfolio-history-header-extra-buttons'

const showMeBy = (filterText = '') => {
  if (filterText) {
    $('.ui-table-row').hide()

    $('.i-portfolio-table-inner-name-symbol').each((index, element) => {
      const didMatch = element.innerText
        .trim()
        .toLowerCase()
        .replace(/[\s]*/gi, '')
        .includes(filterText.toLowerCase())

      if (didMatch) {
        $(element).closest('.ui-table-row').show()
      }
    })
  } else {
    $('.ui-table-row').show()
  }
}

export const PortfolioHistoryHeaderExtraButtons = () => {
  const searchBoxRef = React.createRef<TextFieldBase>()
  const [filterText, filterTextSet] = React.useState<string | undefined>('')

  return (
    <Stack horizontal horizontalAlign='center' id={ELEMENT_ID}>
      <TextField
        componentRef={searchBoxRef}
        placeholder={i18n.輸入以過濾()}
        iconProps={{ iconName: filterText ? 'FilterSolid' : 'Filter' }}
        onChange={debounce((event, newValue) => {
          filterTextSet(newValue)
          showMeBy(newValue)
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

PortfolioHistoryHeaderExtraButtons.hasRendered = () =>
  !!$(`#${ELEMENT_ID}`).length

PortfolioHistoryHeaderExtraButtons.construct = () => {
  if (PortfolioHistoryHeaderExtraButtons.hasRendered()) {
    return
  }

  if (!$(`#${ELEMENT_ID}-container`).length) {
    $(`<span id='${ELEMENT_ID}-container'></span>`).appendTo(
      '.p-portfolio.history .inner-header tab-switch',
    )
  }

  $(`#${ELEMENT_ID}-container`).length &&
    ReactDOM.render(
      <Provider store={store}>
        <PortfolioHistoryHeaderExtraButtons></PortfolioHistoryHeaderExtraButtons>
      </Provider>,
      $(`#${ELEMENT_ID}-container`).get(0),
    )
}

GM.addStyle(`
  #${ELEMENT_ID}-container {
    display: inline-block;
    margin-left: 16px;
  }
`)
