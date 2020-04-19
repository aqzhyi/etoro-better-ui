import Emittery from 'emittery'

export const emitter = new Emittery()

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
}
