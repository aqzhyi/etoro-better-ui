import store from '@/store/_store'
import { setBetterEtoroUIConfig } from '@/actions/setBetterEtoroUIConfig'
import { angularAPI } from '@/angularAPI'

const saveToStorage = () => {
  globalThis.setTimeout(() => {
    const input = $(angularAPI.selectors.dialogAmountInput)
    const amount = Number(input.val()?.toString().replace(/[$,]/gi, '').trim())

    const state = store.getState()

    store.dispatch(
      setBetterEtoroUIConfig({
        executionAmountLast: Number.isNaN(amount) ? 200 : amount,
      }),
    )
  }, 100)
}

export const applyRiskAndAmountSaveToMemory = () => {
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

  $('body').on(
    'click',
    angularAPI.selectors.dialogAmountSteppers,
    saveToStorage,
  )

  $('body').on('blur', angularAPI.selectors.dialogAmountInput, saveToStorage)
}
