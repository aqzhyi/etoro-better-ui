import debug from 'debug'

const root = debug('etoro-better-ui')

export const debugAPI = {
  root,
  tampermonkey: root.extend('tampermonkey'),
}
