import React from 'react'
import ReactDOM from 'react-dom'
import { getRandomString } from '~/utils/getRandomString'
import store from '~/store/_store'
import { Provider } from 'react-redux'
import { IconAsErrorBoundary } from '~/components/IconAsErrorBoundary'

export const componentContainerHTMLDataPrefix = 'data-etoro-better-ui-created'

export const registeredComponents = new Map<
  string,
  {
    mount: () => void
    unmount: () => Promise<any>
    container: HTMLElement
  }
>()

/**
 * Aims to stick React-Components to Angular UIs, automatically
 *
 * ❗️IMPORTANT: after you call this function, also you should import it on file
 * at @utils/renderStickReactComponents
 *
 * @example <caption>Basic</caption>
 *   // ~/components/MyComponent.tsx
 *   egisterReactComponent({
 *     component: <MyComponent />,
 *     containerId: MyComponent.name,
 *     containerConstructor: componentContainer => {
 *       $('.i-menu-link[href^="/feed"]').prepend(componentContainer)
 *     },
 *   })
 *
 *   // ~/utils/renderStickReactComponents.ts
 *   import '~/components/MyComponent'
 */
export const registerReactComponent = <
  Component extends React.FC<Parameters<Component>[0]>
>(options: {
  /**
   * Required, the component to ReactDOM.render()
   *
   * Do NOT pass <Provider store={store} />, this function will do it.
   *
   * @example
   *   component: <ExecutionDialogStatusInfo />
   */
  component: JSX.Element
  /** E.g. `'umjisp19neq' or 'SomeComponentUniqueId'` */
  containerId: string
  containerClassName?: string
  /** Defaults `'span'`, the container element tag that for ReactDOM.render(). */
  containerTag?: string
  /**
   * @example
   *   // ReactDOM.render(component, document.querySelector(`#{containerElement.id}`))
   *
   *   containerConstructor(containerElement => {
   *     jQuery(containerElement).addClass('colorful').insertAfter('body')
   *   })
   */
  containerConstructor: (
    /** The container is React Root, which is ReactDOM.render were to render */
    containerElement: Element,
    props: {
      componentProps: Parameters<Component>[0]
    },
  ) => void
  disabled?: () => boolean
}) => {
  const containerTag = options.containerTag || 'span'
  const newContainerElement = $(`<${containerTag}>`)

  const checkContainerExists = () =>
    options.containerId ? $(`[id="${options.containerId}"]`).length > 0 : false

  const existsContainerElement = $(`[id="${options.containerId}"]`)

  const targetContainerElement =
    existsContainerElement?.get(0) || newContainerElement.get(0)

  const containerId = options.containerId || getRandomString()

  const registerComponent = registeredComponents.get(containerId)

  if (registerComponent) {
    return registerComponent
  }

  newContainerElement
    .attr('id', `${containerId}`)
    .attr(componentContainerHTMLDataPrefix, containerId)
  options.containerClassName &&
    newContainerElement.addClass(options.containerClassName)

  const checkDisabled = () => options.disabled?.() ?? false

  const unmount = () => {
    // setTimeout to avoid errors which the polyfills-es5.js on etoro
    return new Promise((resolve, reject) => {
      globalThis.setTimeout(() => {
        if (targetContainerElement) {
          ReactDOM.unmountComponentAtNode(targetContainerElement)
        }

        resolve(null)
      })
    })
  }

  unmount.displayName = `unmount${containerId}`

  const mount = () => {
    if (checkContainerExists() === false && checkDisabled() === false) {
      options.containerConstructor(targetContainerElement, {
        componentProps: options.component.props,
      })
    }

    if (checkContainerExists() === true && checkDisabled() === false) {
      ReactDOM.render(
        <Provider store={store}>
          <IconAsErrorBoundary>{options.component}</IconAsErrorBoundary>
        </Provider>,
        targetContainerElement,
      )
    }
  }

  mount.displayName = `mount${containerId}`

  registeredComponents.set(containerId, {
    mount,
    unmount,
    container: targetContainerElement,
  })

  return registeredComponents.get(containerId) as NonNullable<
    ReturnType<typeof registeredComponents['get']>
  >
}
