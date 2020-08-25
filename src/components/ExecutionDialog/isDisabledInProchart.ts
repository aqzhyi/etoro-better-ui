import { storage } from '~/storage'

export const isDisabledInProchart = () => {
  if (
    !storage.findConfig().executionMacroEnabledInProchart &&
    globalThis.location.href.toLowerCase().includes('app/prochart')
  ) {
    return true
  }

  return false
}
