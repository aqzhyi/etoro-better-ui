import Emittery from 'emittery'
import { debugAPI } from '@/debugAPI'

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
  onWatchlistPageHover = 'onWatchlistPageHover',
  onPortfolioPageHover = 'onPortfolioPageHover',
  onSidebarHover = 'onSidebarHover',
}

export const emitter = new Emittery.Typed<
  Record<string, any>,
  keyof typeof Events
>()
