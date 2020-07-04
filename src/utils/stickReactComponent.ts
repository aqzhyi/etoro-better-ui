import ReactDOM from 'react-dom'
import { getRandomString } from '@/utils/getRandomString'

type ReactComponentUtils = ReturnType<typeof stickReactComponent>

export const mountedStickyComponents = new Map<
  string,
  ReactComponentUtils['unmount']
>()

export const mountableStickyComponents = new Map<
  string,
  ReactComponentUtils['mount']
>()

/**
 * Aims to stick React-Components to Angular UIs, automatically
 */
export const stickReactComponent = (options: {
  /**
   * required, the component to ReactDOM.render()
   * @example
   *  component: (
   *    <Provider store={store}>
   *      <ExecutionDialogStatusInfo />
   *    </Provider>
   *  )
   */
  component: JSX.Element
  /** e.g. `'umjisp19neq' or 'SomeComponentUniqueId'` */
  containerId: string
  /** defaults `'span'`, the container element tag that for ReactDOM.render(). */
  containerTag?: string
  /**
   * @example
   *  containerConstructor((containerElement) => {
   *    jQuery(containerElement).addClass('colorful').insertAfter('body')
   *  })
   */
  containerConstructor: (containerElement: Element) => void
  disabled?: () => boolean
}) => {
  const containerTag = options.containerTag || 'span'
  const newContainerElement = $(`<${containerTag}>`)

  const checkContainerExists = () =>
    options.containerId ? $(`#${options.containerId}`).length > 0 : false

  const existsContainerElement = $(`#${options.containerId}`)

  const targetContainerElement =
    existsContainerElement?.get(0) || newContainerElement.get(0)

  const containerId = options.containerId || getRandomString()
  newContainerElement.attr('id', `${containerId}`)

  const checkDisabled = () => options.disabled?.() ?? false

  const unmount = () => {
    // setTimeout to avoid errors which the polyfills-es5.js on etoro
    return new Promise((resolve, reject) => {
      globalThis.setTimeout(() => {
        if (targetContainerElement) {
          ReactDOM.unmountComponentAtNode(targetContainerElement)
          targetContainerElement.remove()
          mountedStickyComponents.delete(targetContainerElement.id)
        }

        resolve()
      })
    })
  }

  unmount.displayName = `unmount${containerId}`

  const mount = () => {
    if (checkContainerExists() === false && checkDisabled() === false) {
      options.containerConstructor(targetContainerElement)
    }

    if (checkContainerExists() === true && checkDisabled() === false) {
      ReactDOM.render(options.component, targetContainerElement)

      mountedStickyComponents.set(targetContainerElement.id, unmount)
    }
  }

  if (targetContainerElement.id) {
    mountableStickyComponents.set(targetContainerElement.id, mount)
  }

  mount.displayName = `mount${containerId}`

  return {
    mount,
    unmount,
    containerId,
  }
}
