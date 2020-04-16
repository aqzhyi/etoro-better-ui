import Emittery from 'emittery'

export const emitter = new Emittery()

export enum EmitterEvents {
  ready = 'ready',
  sidebarButtonsArranged = 'sidebarButtonsArranged',
  exchangeChanged = 'exchangeChanged',
  onPing = 'onPing',
}
