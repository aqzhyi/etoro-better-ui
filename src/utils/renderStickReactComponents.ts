import { mountableStickyComponents } from '@/utils/stickReactComponent'

export const renderStickReactComponents = () => {
  for (const [, mount] of mountableStickyComponents) {
    mount()
  }
}
