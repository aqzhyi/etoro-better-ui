import Emittery from 'emittery'

export const emitter = new Emittery.Typed<
  Record<string, any>,
  'ready' | 'onPing' | 'settingChange'
>()

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
}
