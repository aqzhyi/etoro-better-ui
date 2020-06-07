import { debugAPI } from './debugAPI'

const log = debugAPI.log.extend('GM')

/** Adds the given style to the document and returns the injected style element. */
interface GM_addStyle {
  (css: string): void
}

interface GM_xmlhttpRequest {
  SuccessEvent: {
    status: number
    statusText: string
    responseText: string
  }

  (detail: {
    method: 'GET' | 'HEAD' | 'POST'
    /** the destination URL */
    url: string
    /** some string to send via a POST request */
    data?: any

    onload(event: ReturnType<GM_xmlhttpRequest>)
    onerror(error: Error)
  }): {
    status: number
    statusText: string
    responseText: string
  }
}

export const GM = {
  addStyle: globalThis['GM_addStyle'] as GM_addStyle,
  ajax: (detail: { method: 'GET'; url: string }) => {
    const ownlog = log.extend('ajax')

    ownlog(`${detail.method} ${detail.url}`)

    type SuccessEvent = GM_xmlhttpRequest['SuccessEvent']

    return new Promise<SuccessEvent>((resolve, reject) => {
      ;(globalThis['GM_xmlhttpRequest'] as GM_xmlhttpRequest)({
        ...detail,
        onload: (event: SuccessEvent) => {
          resolve(event)
        },
        onerror: error => {
          reject(error)
        },
      })
    })
  },
}
