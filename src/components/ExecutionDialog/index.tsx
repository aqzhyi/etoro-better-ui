import * as React from 'react'
import ReactDOM from 'react-dom'
import { debugAPI } from '../../debugAPI'
import { GM } from '../../GM'
import { Dashboard } from './Dashboard'
import { Provider } from 'react-redux'
import store from '@/store/_store'

const com = {
  log: debugAPI.log.extend('下單輔助巨集'),
  get isParentConstructed() {
    return (
      !!$('.uidialog').length &&
      (!!$('[data-etoro-automation-id="execution-is-refund-daily-value"]')
        .html()
        ?.trim() ||
        $('[data-etoro-automation-id="execution-deposit-button"]')
          .html()
          ?.trim())
    )
  },
  get isConstructed() {
    return !!$('#ExecutionDialog-ExecutionWrap').html()?.length
  },
  construct: () => {
    // 確保元素存在，可以加多新介面進去
    $('.uidialog .execution-main').prepend(
      '<div id="ExecutionDialog-ExecutionWrap"></div>',
    )

    ReactDOM.render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
      globalThis.document.querySelector('#ExecutionDialog-ExecutionWrap'),
    )

    $('#ExecutionDialog-ExecutionWrap')
      .eq(0)
      .nextAll('#ExecutionDialog-ExecutionWrap')
      .remove()

    com.log('安排')
  },
}

GM.addStyle(`
  @media (min-width:741px) {
    .execution-main {
      display: flex;
      justify-content: center;
    }

    #ExecutionDialog-ExecutionWrap {
      margin: 0 auto;
      margin-bottom: 16px;
      text-align: center;
      flex: 0.5;
    }
  }

  @media (max-width:740px) {
    #ExecutionDialog-ExecutionWrap {
      display: none;
    }
  }
`)

export default com
