import debug from 'debug'

const log = debug('etoro-better-ui')

export const debugAPI = {
  universal: log.extend('universal'),
  dialog: log.extend('dialog'),
  keyboard: log.extend('keyboard'),
  redux: log.extend('redux'),
  log,
  events: log.extend('events'),
}
