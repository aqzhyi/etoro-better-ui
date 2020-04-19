import Emittery from 'emittery'

export const emitter = new Emittery.Typed<
  {},
  'ready' | 'onPing' | 'settingChange'
>()

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
}
