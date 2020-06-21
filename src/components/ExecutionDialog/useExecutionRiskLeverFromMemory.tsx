import store from '@/store/_store'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

export const useExecutionRiskLeverFromMemory = () => {
  $('body').delegate('.risk-itemlevel', 'click', (index, element) => {
    const leverText = (index.target as HTMLAnchorElement).innerText
      .trim()
      .replace(/x/i, '')

    const state = store.getState()

    if (state.settings.betterEtoroUIConfig.executionUseApplyLast) {
      store.dispatch(
        setBetterEtoroUIConfig({
          executionLeverLast: Number(leverText),
        }),
      )
    }
  })
}
