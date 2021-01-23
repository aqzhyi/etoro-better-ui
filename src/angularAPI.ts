export const angularAPI = {
  _$rootScope: null as RootScope | null,
  get $rootScope() {
    if (this._$rootScope) {
      return this._$rootScope
    }
    const $rootScope = (($('body').scope?.() as unknown) ||
      null) as RootScope | null
    this._$rootScope = $rootScope
    return $rootScope
  },
  get executionDialogScope() {
    return ($('.execution-head').scope?.() as unknown) as
      | TradeDialogScope
      | undefined
  },
  getRootScope() {
    const $rootScope = (($('body').scope?.() as unknown) ||
      null) as RootScope | null

    return $rootScope
  },
  getTradingConnectionAvailable() {
    return this.getRootScope()?.session.user.portfolioFactory
      .isTradingConnectionAvailable
  },
  selectors: {
    dialogAmountTitleSection: `[data-etoro-automation-id="execution-amount-mode-left-title"]`,
    dialogAmountInputSection:
      '[data-etoro-automation-id="execution-amount-input-section"]',
    dialogAmountInput:
      '[data-etoro-automation-id="execution-amount-input-section"] input',
    dialogAmountSteppers: `
       [data-etoro-automation-id="execution-amount-input-section"] .stepper .stepper-minus
      ,[data-etoro-automation-id="execution-amount-input-section"] .stepper .stepper-plus
    `,
    /** The display price value, the value displaying according to BUY and SELL mode */
    dialogPriceDisplayValue: '.execution-main-head-price-value',
    /** E.g. `'X5'` */
    dialogLeverLevelDisplayText:
      '[data-etoro-automation-id="execution-leverage-tab-title-value"]',
    /** The button on the dialog that trigger switch to the amount */
    dialogSwitchToAmountButton:
      '[data-etoro-automation-id="execution-button-switch-to-amount"]',
    /** The button on the dialog that trigger switch to the unit */
    dialogSwitchToUnitButton:
      '[data-etoro-automation-id="execution-button-switch-to-units"]',
    /** The button on the dialog header that trigger switch to the Buy mode */
    dialogBuyButton: '[data-etoro-automation-id="execution-buy-button"]',
    /** The button on the dialog header that trigger switch to the Sell mode */
    dialogSellButton: '[data-etoro-automation-id="execution-sell-button"]',
    /** The inner content of dialog that the border whose user can see */
    dialogInnerContent: '.uidialog-content',
    /** The Button to switch tab to the panel of stop-loss input */
    dialogStopLossSwitchTab: `
      [name="stopLoss"] > a
      ,[data-etoro-automation-id="edit-position-tab-title-stop-loss-container"] > a
    `,
    dialogSLInput: `
      [data-etoro-automation-id="execution-stop-loss-amount-input"] input
      ,[data-etoro-automation-id="edit-position-tab-title-stop-loss-container"] input
    `,
    dialogStopLossInfiniteButton: `
      [data-etoro-automation-id="execution-set-no-stop-loss-link"]
      ,[data-etoro-automation-id="edit-position-pop-up-no-stop-loss"]
    `,
    /** The Button to switch tab to the panel of take-profit input */
    dialogTakeProfitSwitchTab: `
      [name="takeProfit"] > a
      ,[data-etoro-automation-id="edit-position-tab-title-take-profit-container"] > a
    `,
    dialogTPInput: `
      [data-etoro-automation-id="execution-take-profit-amount-input"] input
      ,[data-etoro-automation-id="edit-position-take-profit-amount-input-section"] input
    `,
    dialogTakeProfitInfiniteButton: `
      [data-etoro-automation-id="execution-set-no-take-profit-link"]
      ,[data-etoro-automation-id="edit-position-pop-up-no-take-profit"]
    `,
  } as const,
  getPositionByInstrumentId(id: number): InstrumentPosition[] {
    const list: InstrumentPosition[] = []

    for (const position of angularAPI.$rootScope?.session.user.portfolio
      .manualPositions || []) {
      if (position.Instrument.InstrumentID === id) {
        const scope = angularAPI.getPositionById(position.PositionID)

        if (scope) list[list.length] = scope
      }
    }

    return list
  },
  getPositionById(positionId: InstrumentPosition['PositionID']) {
    const data = angularAPI.$rootScope?.session.user.portfolio.getPositionById(
      positionId,
    )
    return data
      ? {
          ...data,
          // access etoro function
          close: () => {
            globalThis.setTimeout(() => {
              data.close()
            })
          },
          // getters, which can't Object.assign
          Amount: data.Amount,
          Leverage: data.Leverage,
          CurrentRate: data.CurrentRate,
          Equity: data.Equity,
          InitialAmountInDollars: data.InitialAmountInDollars,
          InitialUnits: data.InitialUnits,
          Instrument: data.Instrument,
          IsBuy: data.IsBuy,
          LastRateChange: data.LastRateChange,
          OpenDateTime: data.OpenDateTime,
          OpenRate: data.OpenRate,
          PositionID: data.PositionID,
          Profit: data.Profit,
          TakeProfitRate: data.TakeProfitRate,
          isPendingClose: data.isPendingClose,
          TakeProfitAmount: data.TakeProfitAmount,
          TakeProfitPercent: data.TakeProfitPercent,
          StopLossAmount: data.StopLossAmount,
          StopLossPercent: data.StopLossPercent,
        }
      : null
  },
  getInstrumentById(instrumentId: Instrument['InstrumentID']) {
    const data = angularAPI.$rootScope?.session.instrumentsFactory.getById(
      instrumentId,
    )
    return data
      ? {
          ...data,
          // trigger values within getters
          lastPrice: data.rate.lastPrice,
          lastAskPrice: data.rate.lastAskPrice,
          lastAskChange: data.rate.lastAskChange,
          lastBidChange: data.rate.lastBidChange,
          IsActive: data.IsActive,
        }
      : null
  },
  get isNativeTradeDialogOpen(): boolean {
    // Target is specified to trade dialog, not else dialogs
    const isTradeDialog = !!$('.execution-main-head-price-value').length
    const isDialogOpen = !!$('.uidialog-open').length

    return (isDialogOpen && isTradeDialog) || false
  },
  setTradeModeToTrade: () => {
    $('[data-etoro-automation-id="execution-trade-mode-drop-box"]').trigger(
      'click',
    )

    // etoro has the three spaces in their element rendered
    $(`
      [data-etoro-automation-id="execution-trade-mode-switch-to-trade   "]
      ,[data-etoro-automation-id="execution-trade-mode-switch-to-trade"]
    `).trigger('click')
  },
  setTradeModeToOrder: () => {
    $('[data-etoro-automation-id="execution-trade-mode-drop-box"]').trigger(
      'click',
    )
    $(
      '[data-etoro-automation-id="execution-trade-mode-switch-to-order"]',
    ).trigger('click')
  },
  getDialogLever: () => {
    return angularAPI.executionDialogScope?.model?.leverages.selectedLeverage
  },
  /**
   * Use jQuery to click the real button
   *
   * The way of angular model sync doesn't work for now
   */
  setDialogLever: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    if (dialogScope?.model) {
      const tabEl = $(
        angularAPI.selectors.dialogLeverLevelDisplayText,
      ).parentsUntil('a')

      tabEl.trigger('click')

      $(`.risk-itemlevel:contains(" x${value} ")`).trigger('click')
    }
  },
  getDialogAmount: () => {
    const dialogScope = angularAPI.executionDialogScope

    return dialogScope?.model?.amount.amount
  },
  /**
   * Set amount value with pass number
   *
   * Finally, the value that will be used should respect to Min Position Number
   * and Leverage value
   *
   * The way of angular model sync may cause the function Open Trade fails
   */
  setDialogAmount: (value: number) => {
    const dialogScope = angularAPI.executionDialogScope

    if (dialogScope?.model) {
      const currentLever = dialogScope?.model?.leverages.selectedLeverage ?? 1

      const etoroMinAmountValue =
        dialogScope?.model?.instrument?.MinPositionAmount ?? value

      const valueWillBe =
        value * currentLever < etoroMinAmountValue ? etoroMinAmountValue : value

      dialogScope.model.amount.inUnitsMode = false
      dialogScope.model.amount.amount = valueWillBe
      dialogScope.model.amount.amountView = valueWillBe

      $(angularAPI.selectors.dialogAmountInput)
        .val(`${valueWillBe}`)
        .delay(50)
        .trigger('change')
        .delay(50)
        .trigger('blur')

      dialogScope.$apply()
    }
  },
  toggleDialogTakeProfitInfinite: () => {
    $(angularAPI.selectors.dialogTakeProfitSwitchTab).trigger('click')
    $(angularAPI.selectors.dialogTakeProfitInfiniteButton).trigger('click')
  },
  toggleDialogStopLossInfinite: () => {
    $(angularAPI.selectors.dialogStopLossSwitchTab).trigger('click')
    $(angularAPI.selectors.dialogStopLossInfiniteButton).trigger('click')
  },
  setDialogStopLoss: (value: number) => {
    $(angularAPI.selectors.dialogStopLossSwitchTab).trigger('click')

    if (!angularAPI.executionDialogScope?.model?.stopLoss.inDollarMode) {
      $(
        `
        [data-etoro-automation-id="execution-stop-loss-rate-editing-switch-to-amount-button"]
        ,[data-etoro-automation-id="edit-position-stop-loss-rate-right-switch-button"]
      `,
      ).trigger('click')
    }

    const amount = angularAPI.executionDialogScope?.model?.amount.amount

    if (!amount) return

    $(angularAPI.selectors.dialogSLInput)
      .val(-(value / 100) * amount)
      .trigger('change')
      .trigger('blur')
  },
  setDialogTakeProfit: (value: number) => {
    $(angularAPI.selectors.dialogTakeProfitSwitchTab).trigger('click')

    if (!angularAPI.executionDialogScope?.model?.takeProfit.inDollarMode) {
      $(
        `
        [data-etoro-automation-id="execution-take-profit-rate-editing-switch-to-amount-button"]
        ,[data-etoro-automation-id="edit-position-take-profit-rate-right-switch-button"]
      `,
      ).trigger('click')
    }

    const amount = angularAPI.executionDialogScope?.model?.amount.amount

    if (!amount) return

    $(angularAPI.selectors.dialogTPInput)
      .val((value / 100) * amount)
      .trigger('change')
      .trigger('blur')
  },
  /**
   * Expected effecting with list history and Portfolio also including people's
   * history and Portfolio
   */
  filterPortfolioListByText: (filterText = '') => {
    if (filterText) {
      $('.ui-table-row').hide()

      $(
        '.table-first-name, .table-last-name, .i-portfolio-table-name-symbol, .ui-table-row',
      ).each((index, element) => {
        const didMatch = element.innerHTML
          .trim()
          .toLowerCase()
          .replace(/[\s]*/gi, '')
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
      [automation-id="watchlist-item-list-instrument-wrapp-rate-change"],
      [automation-id="watchlist-item-list-instrument-sentiment"],
      et-fifty-two-weeks,
      [automation-id="watchlist-item-list-user-wrapp-investors"]
      `,
    ).toggle(!onOff)
  },
  /** 打開關注列表的第一個商品的交易視窗，適用於「關注列表的過濾功能」 */
  openTradeDialog: () => {
    $('[automation-id="buy-sell-button-container-buy"]:visible')
      /**
       * The user may enable the "One-Click Trade", so there to avoid the hit
       * on the mistake
       */
      .not('.one-click')
      .eq(0)
      .trigger('click')
  },
}
