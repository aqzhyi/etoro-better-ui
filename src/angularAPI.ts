import type { IRootScopeService, ILocationService } from 'angular'

interface EtoroRootScope extends IRootScopeService {
  session: {
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
}
