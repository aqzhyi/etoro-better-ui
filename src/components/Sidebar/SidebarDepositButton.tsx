import { i18n } from '@/i18n'
import { GM } from '@/GM'
import { storage } from '@/storage'

const extraElementClassName = 'deposit-extra-info'

export const renderSidebarDepositButton = () => {
  const target = $('.w-menu-footer .e-btn-big-2')
  const betterEtoroUIConfig = storage.findConfig()

  const selected = betterEtoroUIConfig.selectedExchange

  if (target.length && selected !== 'HIDDEN') {
    const currency = betterEtoroUIConfig[selected]

    const extraInfoElement = $(`<span>`)
      .addClass(extraElementClassName)
      .html(i18n.左下入金按鈕(currency.sell))

    if (!target.find(`.${extraElementClassName}`).length) {
      target.append(extraInfoElement)
    } else {
      target.find(`.${extraElementClassName}`).html(extraInfoElement.html())
    }
  } else if (target.length && selected === 'HIDDEN') {
    target.find(`.${extraElementClassName}`).remove()
  }
}

GM.addStyle(`
  .${extraElementClassName} {
    font-size: 12px;
    text-shadow: 1px 1px 1px #4c4c4c;
  }
`)
