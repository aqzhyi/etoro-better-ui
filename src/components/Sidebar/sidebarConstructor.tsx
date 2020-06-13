import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Sidebar, { sidebarCheckReady } from '@/components/Sidebar/Sidebar'
import store from '@/store/_store'

export const sidebarConstructor = () => {
  if (sidebarCheckReady()) {
    return
  }

  if (!$('#sidebarConstructor').length) {
    $('.w-menu-main').append('<span id="sidebarConstructor"><span>')
  }

  globalThis.document.querySelector('#sidebarConstructor') &&
    ReactDOM.render(
      <Provider store={store}>
        <Sidebar />
      </Provider>,
      globalThis.document.querySelector('#sidebarConstructor'),
    )
}
