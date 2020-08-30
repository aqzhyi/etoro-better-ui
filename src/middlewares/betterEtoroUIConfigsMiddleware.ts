import { storage, BetterEtoroUIConfig } from '~/storage'
import { Middleware } from 'redux'
import { PayloadAction } from '@reduxjs/toolkit'
import { debugAPI } from '~/debugAPI'
import { emitter, Events } from '~/emitter'

export const betterEtoroUIConfigsMiddleware: Middleware = api => next => (
  action: PayloadAction<Partial<BetterEtoroUIConfig>>,
) => {
  if (
    typeof action.type === 'string' &&
    action.type.startsWith('setBetterEtoroUIConfig')
  ) {
    debugAPI.enhancer(`localStorage::Patch`, action.payload)
    storage.saveConfig(action.payload)
    emitter.emit(Events.settingChange)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return next(action)
}
