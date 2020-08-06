import store from '@/store/_store'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'

export const applyExecutionRiskLeverFromMemory = () => {
  $('body').on('click', '.risk-itemlevel', (index, element) => {
    const leverText = (index.target as HTMLAnchorElement).innerText
      .trim()
      .replace(/x/i, '')

    const state = store.getState()

    if (state.settings.executionUseApplyLast) {
      store.dispatch(
        setBetterEtoroUIConfig({
          executionLeverLast: Number(leverText),
        }),
      )
    }
  })
}
