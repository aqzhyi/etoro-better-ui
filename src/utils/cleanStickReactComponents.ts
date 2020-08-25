import { registeredComponents } from '~/utils/registerReactComponent'

export const cleanStickReactComponents = () => {
  for (const [id, utils] of registeredComponents) {
    utils.unmount()
  }
}
