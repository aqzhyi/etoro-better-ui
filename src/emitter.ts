import Emittery from 'emittery'

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
  onSidebarHover = 'onSidebarHover',
}

export const emitter = new Emittery.Typed<
  Record<string, any>,
  keyof typeof Events
>()
