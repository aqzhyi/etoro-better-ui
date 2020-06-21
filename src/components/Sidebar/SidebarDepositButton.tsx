import store from '@/store/_store'
import { i18n } from '@/i18n'

export const renderSidebarDepositButton = () => {
  const target = $('.w-menu-footer .e-btn-big-2')
  const state = store.getState()

  if (target.length) {
    target.html(
      i18n.左下入金按鈕(
        state.settings.exchange[state.settings.exchange.selected].sell,
      ),
    )
  }
}
