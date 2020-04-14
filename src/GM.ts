import { debugAPI } from './debugAPI'

const log = debugAPI.tampermonkey.extend('GM')

export const GM = {
  addStyle: globalThis['GM_addStyle'] as (css: string) => void,
  ajax: (detail: { method: 'GET'; url: string }) => {
    const ownlog = log.extend('ajax')

    ownlog(`${detail.method} ${detail.url}`)

    type SuccessEvent = {
      status: number
      statusText: string
      responseText: string
    }
    return new Promise<SuccessEvent>((resolve, reject) => {
      globalThis['GM_xmlhttpRequest']({
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
