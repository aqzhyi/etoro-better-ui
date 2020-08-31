import { registeredComponents } from '~/utils/registerReactComponent'

export const cleanStickReactComponents = (props?: { components: string[] }) => {
  // re mount specified components
  if (props?.components.length) {
    for (const componentId of props?.components) {
      const target = registeredComponents.get(componentId)
      target?.unmount().then(() => {
        target.mount()
      })
    }
  } else {
    // mount all registered components
    for (const [id, utils] of registeredComponents) {
      utils.unmount()
    }
  }
}
