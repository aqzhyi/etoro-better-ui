import { emitter, Events } from '@/emitter'
import { i18n } from '@/i18n'
import cogoToast from 'cogo-toast'
import { throttle } from 'lodash'

/**
 * 提示可用金額
 */
export const ExecutionDialogAvailableValueOnEvent = throttle(function () {
  /** from etoro html element */
  const availableValue = $(
    `[automation-id="account-balance-availible-unit-value"]`,
  ).html()

  cogoToast.info(i18n.當前可用餘額(availableValue), {
    position: 'bottom-left',
    hideAfter: 5,
  })
}, 5100)
