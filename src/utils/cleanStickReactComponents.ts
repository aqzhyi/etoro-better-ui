import { mountedStickyComponents } from '@/utils/stickReactComponent'

export const cleanStickReactComponents = () => {
  for (const [, unmount] of mountedStickyComponents) {
    unmount()
  }
}
