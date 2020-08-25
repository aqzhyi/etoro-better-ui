import { emitter, Events } from '~/emitter'

export let sidebarDynamicNgContent = ''

emitter.once(Events.ready).then(function cacheSidebarNgContentAttr() {
  sidebarDynamicNgContent =
    Array.from($('.w-menu').get(0).attributes).find(value =>
      value.name.includes('_ngcontent'),
    )?.name || ''
})
