import type { IRootScopeService, ILocationService } from 'angular'

interface EtoroRootScope extends IRootScopeService {
  session: {
    locale: 'en-gb' | 'zh-tw' | 'zh-cn'
    accountMode: 'Demo' | 'Real'
    user: {
      portfolio: {
        /** 可用餘額 */
        availibleToTrade: number
        /** 淨值 */
        equity: number
        /** 利潤 */
        totalProfit: number
        /** 總配額 */
        totalInvestedAmount: number
      }
    }
  }
  layoutCtrl: { $location: ILocationService } & {
    isBannerShown: boolean
    isLoaded: boolean
    isMobile: boolean
    isWrapper: boolean
    showFooter: boolean
    showLoginButton: boolean
    uiDialog: {
      isDialogOpen: boolean
      isKycDialogOpen: boolean
      latestID: string
    }
  }
}

export const angularAPI = {
  _$rootScope: null as EtoroRootScope | null,
  get $rootScope() {
    if (this._$rootScope) {
      return this._$rootScope
    }
    const $rootScope = ($('body').scope() as unknown) as EtoroRootScope
    this._$rootScope = $rootScope
    return $rootScope
  },
  /** Expected effecting with list history and Portfolio also including people's history and Portfolio */
  filterPortfolioListByText: (filterText = '') => {
    if (filterText) {
      $('.ui-table-row').hide()

      $(
        '.table-first-name, .table-last-name, .i-portfolio-table-name-symbol',
      ).each((index, element) => {
        const didMatch = element.innerHTML
          .trim()
          .toLowerCase()
          .includes(filterText.toLowerCase().trim())

        if (didMatch) {
          $(element).closest('.ui-table-row').show()
        }
      })
    } else {
      $('.ui-table-row').show()
    }
  },
  /** Expected effecting with list People, Instruments that you watching */
  filterWatchlistByText: (filterText = '') => {
    if (filterText) {
      $(
        'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
      ).hide()

      $(
        '[automation-id=trade-item-name], [automation-id="trade-item-full-name"]',
      ).each((index, element) => {
        const didMatch = element.innerText
          .trim()
          .toUpperCase()
          .includes(filterText.trim().toUpperCase())

        if (didMatch) {
          $(element)
            .closest(
              'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
            )
            .show()
        }
      })
    } else {
      $(
        'et-user-row, et-user-card, et-instrument-row, et-instrument-card',
      ).show()
    }
  },
  /** Expected effecting with list People and Instruments that you invested */
  toggleListInvested: (onOff: boolean) => {
    if (onOff) {
      $('et-instrument-row, et-user-row').hide()
      $('.instrument-list-pie-link')
        .closest('et-instrument-row, et-user-row')
        .show()
    } else {
      $('et-instrument-row, et-user-row').show()
    }
  },
  /** Expected effecting with list People and Instruments that you watching */
  toggleListCompact: (onOff: boolean) => {
    $(
      `
      [automation-id="watchlist-item-list-instrument-chart"],
      [automation-id="watchlist-item-list-instrument-sentiment"],
      et-fifty-two-weeks,
      [automation-id="watchlist-item-list-user-wrapp-investors"]
      `,
    ).toggle(!onOff)
  },
}
