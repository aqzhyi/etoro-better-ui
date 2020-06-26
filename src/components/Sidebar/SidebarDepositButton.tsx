import store from '@/store/_store'
import { i18n } from '@/i18n'

export const renderSidebarDepositButton = () => {
  const target = $('.w-menu-footer .e-btn-big-2')
  const state = store.getState()

  const selected = state.settings.betterEtoroUIConfig.selectedExchange

  if (target.length && selected !== 'USD') {
    const sell = state.settings.betterEtoroUIConfig[selected]?.sell

    sell &&
      target.html(
        i18n.左下入金按鈕(state.settings.betterEtoroUIConfig[selected].sell),
      )
  }
}
