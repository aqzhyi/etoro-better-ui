/* eslint-disable @typescript-eslint/no-unsafe-return */
import Emittery from 'emittery'
import { debugAPI } from '~/debugAPI'

export enum Events {
  ready = 'ready',
  onPing = 'onPing',
  settingChange = 'settingChange',
  onWatchlistPageHover = 'onWatchlistPageHover',
  onPortfolioPageHover = 'onPortfolioPageHover',
  onPortfolioHistoryPageHover = 'onPortfolioHistoryPageHover',
  onSidebarHover = 'onSidebarHover',
  onDialogHover = 'onDialogHover',
  onDialogNotFound = 'onDialogNotFound',
  onMoreInfoButtonHover = 'onMoreInfoButtonHover',
  onCloseAllPositionsDialogHover = 'onCloseAllPositionsDialogHover',
  onMountUIs = 'onMountUIs',
  onUnmountUIs = 'onUnmountUIs',
}

const __NO_NAME__ = '__NO_NAME__'

export const emitter = new Emittery.Typed<
  Record<string, any>,
  keyof typeof Events
>()

// 使每個 emitter 之 events 的接受端受到 emit 觸發時，皆會記錄在 console
emitter.on = new Proxy(emitter.on.bind(emitter), {
  apply(
    target,
    key,
    receiver: [Events, ((...args) => any) & { displayName?: string }],
  ) {
    if (typeof receiver[1] === 'function') {
      receiver[1] = new Proxy(receiver[1], {
        apply(listenserTarget, listenserKey, listenserReceiver) {
          const displayName =
            (receiver[1]?.displayName || receiver[1].name).replace(
              /^_?/i,
              '',
            ) || __NO_NAME__

          debugAPI.events.extend('.on')(receiver[0], displayName)
          return Reflect.apply(listenserTarget, listenserKey, listenserReceiver)
        },
      })
    }

    return Reflect.apply(target, key, receiver)
  },
})

// 使每個 emitter 之 events 的接受端受到 emit 觸發時，皆會記錄在 console
emitter.once = new Proxy(emitter.once.bind(emitter), {
  apply(onceFn, key, receiver: [Events, (...args) => any]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newOnceFn = Reflect.apply(onceFn, key, receiver)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    newOnceFn['then'] = new Proxy(newOnceFn['then'], {
      apply: (
        listenserTarget,
        listenserKey,
        listenserReceiver: [((...args) => unknown) & { displayName?: string }],
      ) => {
        const displayName =
          (
            listenserReceiver[0].displayName || listenserReceiver[0].name
          ).replace(/^_?/i, '') || __NO_NAME__

        debugAPI.events.extend('.once')(receiver[0], displayName)
        return Reflect.apply(listenserTarget, listenserKey, listenserReceiver)
      },
    })

    return newOnceFn
  },
})
