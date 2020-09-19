type IRootScopeService = import('angular').IRootScopeService

declare interface RootScope extends IRootScopeService {
  session: {
    locale: 'en-gb' | 'zh-tw' | 'zh-cn'
    accountMode: 'Demo' | 'Real'
    user: {
      portfolioFactory: {
        isTradingConnectionAvailable: boolean
      }
      portfolio: {
        api: '/sapi/trade-demo' | '/sapi/trade-real'
        /** 可用餘額 */
        availibleToTrade: number
        /** 淨值 */
        equity: number
        /** 利潤 */
        totalProfit: number
        /** 總配額 */
        totalInvestedAmount: number
        /** 所有開倉位（按 Instrument 分組） */
        groups?: {
          /** 標的名稱 */
          GroupName: string
          Amount: number
          /** 標的圖示 */
          Avatar: string
          AverageOpenRate: number
          /** 當前淨值 */
          Equity: number
          FirstOpenDate: Date
          InstrumentID: number
          Instrument: Instrument
          /** e.g. `-8.578` 代表全部倉位損益 -0.86% */
          TotalGain: number
          /** e.g. `-10.458636130000016` 代表全部倉位損益 -10.45$USD */
          TotalProfit: number
          /** 當前倉位 */
          Positions: InstrumentPosition[]
        }[]
        /** 掛單倉位 */
        orders: PendingOrder[]
        /** 手動開倉倉位 */
        manualPositions: InstrumentPosition[]
        /** 所有開倉倉位 */
        positions: Partial<{
          [PositionId: string]: InstrumentPosition
        }>
        getPositionById(
          id?: InstrumentPosition['PositionID'],
        ): InstrumentPosition | undefined
      }
    }
    instrumentsFactory: {
      getAll(): {
        [id: number]: Instrument
      }
      /**
       * e.g. `1001` returns instrument of AAPL
       */
      getById(id: Instrument['InstrumentID']): Instrument
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
      /**
       * @describe
       * Usually causes react unexpected render error
       *
       * @deprecated
       */
      isDialogOpen: boolean
      isKycDialogOpen: boolean
      latestID: string
    }
  }
}
