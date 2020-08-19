import * as React from 'react'
import { HighlightText } from '@/components/TooltipHighlightText'
import { angularAPI } from '@/angularAPI'
import Tooltip from 'rc-tooltip'
import { PrimaryButton } from '@fluentui/react'
import { toggleSettingsDialog } from '@/actions/toggleSettingsDialog'

/**
  Naming Style

  expected the literal as key to be `[Objective].[Subject]?.[Aim]`


  ```ts
  e.g. Aim =
    // should be use in brief to describe the functionality
    // Usage: display in setting dialog as label or and as a component tooltip
    | 'brief'

    // short text to display and describe the functionality
    // Usage: display on a button or side of a component
    | 'text'

    // expect to help people how this functionality work or setup
    // Usage: Tell user how to use, e.g. A set of Numbers and split with comma for example `'100,200,300'`
    | 'help'
  ```
 */
const zh = {
  dialog_buttonsSetup_brief: () => (
    <React.Fragment>
      下單輔助按鈕之金額設定（請用逗號隔開數字）e.g. 100,200,300,500,1000。
    </React.Fragment>
  ),
  dialog_buttonsSetup_help: () =>
    '金額設定（請用逗號隔開數字）e.g. 100,200,300,500,1000。',
  dialog_buttonsSetup_text: () => '設定',
  dialog_enabledInProchart_brief: () => (
    <React.Fragment>在 Prochart 中停用所有下單輔助介面。</React.Fragment>
  ),
  dialog_enabled_brief: () => (
    <React.Fragment>
      啟用快速下單輔助按鈕集成；你能夠自訂這些按鈕
    </React.Fragment>
  ),
  dialog_fixedNextOrderValue_brief: () =>
    '鎖定你每一次下單金額數字與槓桿倍率，此功能以你上一次的下單輔助按鈕點擊，作為記錄點',
  dialog_fixedNextOrderValue_text: () => '金額槓桿鎖定',
  dialog_fixedNextOrderValueNot_text: () => '金額槓桿鎖定?',
  exchange_usedSetup_brief: (selectedText: string) =>
    `設定幣別（當前：${selectedText}）`,
  filterText_clearText_text: () => '清除輸入',
  filterText_input_brief: () => (
    <span>
      使用 <HighlightText>Enter</HighlightText> 可以開啟第一個標的之下單框。使用{' '}
      <HighlightText>Escape</HighlightText> 可以清除輸入框。{' '}
    </span>
  ),
  filterText_input_help: () => '過濾...',
  link_checkBalance_text: () => '餘額',
  link_deposit_text: (value: number) => `（${value}）銀行賣出`,
  link_donation_text: () => '贊助作者',
  link_extensionWebsite_text: () => '腳本官網',
  link_pendingOrders_text: () => `我的掛單`,
  link_portfolio_text: () => '投資組合',
  link_riskKnown_text: (Link: React.FC) => {
    return (
      <span>
        {' '}
        本程式非官方提供，請確保您知道使用風險 <Link />{' '}
      </span>
    )
  },
  link_withdrawExtra_text: (value: React.ReactNode) => (
    <React.Fragment>（{value}）銀行買入</React.Fragment>
  ),
  profits_availableValues_text: () => '可用餘額',
  profits_fixedStopLossTakeProfitEnabled_brief: () =>
    `每次下單自動套用「止損」與「止盈」％數`,
  profits_fixedStopLossValueOnOrder_help: (lastPercent: number) =>
    `套用每次下單的「止損」趴數，當前設定：${lastPercent}％`,
  profits_fixedStopLossValueOnOrder_brief: (lastPercent: number) =>
    `每次下單視窗開啟時，套用止損趴數（當前設定：${lastPercent}％）。請注意，有些商品可能有所謂「最低止損」的限制。`,
  profits_fixedTakeValueOnOrder_help: (lastPercent: number) =>
    `套用每次下單的「止盈」趴數，當前設定：${lastPercent}％`,
  profits_fixedTakeValueOnOrder_brief: (lastPercent: number) =>
    `每次下單視窗開啟時，套用止盈趴數（當前設定：${lastPercent}％）。請注意，有些商品可能有所謂「最低止損」的限制。`,
  profits_invested_brief: () => (
    <span>
      {' '}
      只顯示<HighlightText>已投資</HighlightText>的標的或投資者{' '}
    </span>
  ),
  profits_invested_text: () => '已投資',
  profits_selectedObjective_brief: (selected?: string) =>
    selected ? `${selected} @ 開倉位當前利潤` : '沒有選擇標的',
  setting_resetAll_text: () => '重置所有設定',
  status_inferringDelay_text: () => `大概延遲`,
  universal_amount_text: () => '金額',
  universal_compact_brief: () =>
    '不顯示關注列表中的無用介面（當前以開發者視角主觀認定）',
  universal_compact_text: () => '緊湊',
  universal_doAvoid_text: (actionName: string) =>
    `🔴 ${
      actionName ? `「${actionName}」` : ''
    }動作沒有執行，可能介面不存在，或發生錯誤`,
  universal_doChanged_text: (PostComponent: React.FC) => {
    return (
      <span>
        {' '}
        設定已變更： <PostComponent />{' '}
      </span>
    )
  },
  universal_doChanging_text: () => '設定變更中...',
  universal_doNothing_text: (PostComponent: React.FC) => {
    return (
      <span>
        {' '}
        設定未變更： <PostComponent />{' '}
      </span>
    )
  },
  universal_errorOnRender_text: (error: Error) => (
    <span>錯誤：{error.message}</span>
  ),
  universal_extensionName_text: () => 'eToro better UI',
  universal_extensionSupportName_text: (Link: React.FC) => {
    return (
      <span>
        {' '}
        本功能由 <Link /> 提供{' '}
      </span>
    )
  },
  universal_googleAnalyticsEnabled_brief: () =>
    `允許 etoro-better-ui 能夠使用並分析，介面的操作情況 (這個功能不會收集您的隱私資料)`,
  universal_intervalCheckingStatus_brief: () =>
    `在下單視窗上方的「推估延遲狀態」與「交易系統運作狀況」，設定每隔 N 秒重新整理；越短的檢查時間，會消耗更多的性能`,
  universal_lever_text: () => '槓桿',
  universal_setup_text: () => '設定',
  universal_useKeyboardHotkeys_brief: () => (
    <React.Fragment>
      <Tooltip placement='left' overlay={'在下單視窗開啟時，有效'}>
        <div>
          熱鍵 <HighlightText>TAB 鍵</HighlightText> 切換「賣出」或「買入」。
        </div>
      </Tooltip>

      <Tooltip placement='left' overlay={'在下單視窗開啟時，有效'}>
        <div>
          熱鍵 <HighlightText>空白鍵</HighlightText> 觸發下單開倉。
        </div>
      </Tooltip>

      <Tooltip placement='left' overlay={'在彈出視窗開啟時，有效'}>
        <div>
          熱鍵 <HighlightText>ESC 鍵</HighlightText> 可以關閉視窗。
        </div>
      </Tooltip>

      <Tooltip placement='left' overlay={'在關注列表有效'}>
        <div>
          熱鍵 <HighlightText>F 鍵</HighlightText> 可以進行篩選清單。
        </div>
      </Tooltip>
    </React.Fragment>
  ),
  universal_useKeyboardHotkeys_help: (openSettings: () => void) => {
    return (
      <React.Fragment>
        <span>
          您尚未開啟「熱鍵」系統，現在前往開啟？{' '}
          <PrimaryButton
            onClick={() => {
              openSettings()
            }}
          >
            前往
          </PrimaryButton>{' '}
        </span>
      </React.Fragment>
    )
  },
  universal_welcomeMessage_text: (Link: React.FC) => {
    return (
      <React.Fragment>
        <span>
          <HighlightText>強烈建議您</HighlightText>
          ：在非交易日，或非交易時間，執行安裝，或更新新版本；並在虛擬交易中，嘗試之後，再應用於真實交易之上
        </span>
      </React.Fragment>
    )
  },
}

const en: typeof zh = {
  dialog_buttonsSetup_brief: () => (
    <React.Fragment>
      Fill value of <HighlightText>Trade Order</HighlightText> on the investment
      by one click on <HighlightText>Trading Buttons</HighlightText>, and each
      number has to split by comma. e.g. 100,200,300,500,1000. Use the Enter key
      to save.
    </React.Fragment>
  ),
  dialog_buttonsSetup_help: () =>
    'Values Setup, each number has to split by comma. e.g. 100,200,300,500,1000. Use the Enter key',
  dialog_buttonsSetup_text: () => 'Setup',
  dialog_enabledInProchart_brief: () => (
    <React.Fragment>
      Disabled all of Trade Execution-Dialog functions, when the page is
      Prochart
    </React.Fragment>
  ),
  dialog_enabled_brief: () => (
    <React.Fragment>
      Enable Execution-Dialog <HighlightText>Trading Buttons</HighlightText>,
      and it also can be customized.
    </React.Fragment>
  ),
  dialog_fixedNextOrderValue_brief: () =>
    `Always use the last Amount and Lever, which previously value you click on Execution-Dialog Trading buttons.`,
  dialog_fixedNextOrderValue_text: () => 'Amount/Lever Fixed',
  dialog_fixedNextOrderValueNot_text: () => 'Amount/Lever Fixed?',
  exchange_usedSetup_brief: (selectedText: string) =>
    `Currency（Now：${selectedText}）`,
  filterText_clearText_text: () => 'Remove Text',
  filterText_input_brief: () => (
    <span>
      Use the <HighlightText>Enter</HighlightText> key to open the first
      Execution Dialog. Use the <HighlightText>Escape</HighlightText> to clear
      the input .{' '}
    </span>
  ),
  filterText_input_help: () => 'Filter...',
  link_checkBalance_text: () => 'Balance',
  link_deposit_text: (value: number) => `（${value}）Sold`,
  link_donation_text: () => 'Donate',
  link_extensionWebsite_text: () => 'Website',
  link_pendingOrders_text: () => `Pending Orders`,
  link_portfolio_text: () => 'portfolio',
  link_riskKnown_text(Link: React.FC) {
    return (
      <span>
        {' '}
        This extension is not official. Make sure you know you have risk when
        using this extension. <Link />{' '}
      </span>
    )
  },
  link_withdrawExtra_text: (value: React.ReactNode) => (
    <React.Fragment>{value}</React.Fragment>
  ),
  profits_availableValues_text: () => 'Available Value',
  profits_fixedStopLossTakeProfitEnabled_brief: () =>
    `When Trade Execution-Dialog on mount, it's applying percent of Stop-Loss and TakeProfit`,
  profits_fixedStopLossValueOnOrder_help: (lastPercent: number) =>
    `Apply percent of Stop-Loss, current: ${lastPercent}%`,
  profits_fixedStopLossValueOnOrder_brief: (lastPercent: number) =>
    `When Trade Execution-Dialog on mount, it's applying percent of Stop-Loss (will apply ${lastPercent}%). Notable that there some instruments that may have the limit of min Stop Loss.`,
  profits_fixedTakeValueOnOrder_help: (lastPercent: number) =>
    `Apply percent of Take-Profit, current: ${lastPercent}%`,
  profits_fixedTakeValueOnOrder_brief: (lastPercent: number) =>
    `When Trade Execution-Dialog on mount, it's applying percent of Take-Profit (will apply ${lastPercent}%). Notable that there some instruments that may have the limit of min Take Profit.`,
  profits_invested_brief: () => (
    <span>
      {' '}
      Display <HighlightText>invested</HighlightText> only. (people and
      instruments){' '}
    </span>
  ),
  profits_invested_text: () => 'Invested',
  profits_selectedObjective_brief: (selected?: string) =>
    selected ? `Profits @ Positions on ${selected}` : 'Not selected',
  setting_resetAll_text: () => 'Reset All of Settings',
  status_inferringDelay_text: () => `Infer Delay`,
  universal_amount_text: () => 'Amount',
  universal_compact_brief: () =>
    'Do NOT display unnecessary UIs (proposed by author)',
  universal_compact_text: () => 'compact',
  universal_doAvoid_text: (actionName: string) =>
    `🔴 ${
      actionName ? `「${actionName}」` : ''
    }No Action Execution, Target not found, or maybe something broken.`,
  universal_doChanged_text: (PostComponent: React.FC) => {
    return (
      <span>
        {' '}
        Has been changed： <PostComponent />{' '}
      </span>
    )
  },
  universal_doChanging_text: () => 'loading...',
  universal_doNothing_text: (PostComponent: React.FC) => {
    return (
      <span>
        {' '}
        Nothing changes： <PostComponent />{' '}
      </span>
    )
  },
  universal_errorOnRender_text: (error: Error) => (
    <span>ERROR: {error.message}</span>
  ),
  universal_extensionName_text: () => 'eToro better UI',
  universal_extensionSupportName_text: (Link: React.FC) => {
    return (
      <span>
        {' '}
        Support By <Link />{' '}
      </span>
    )
  },
  universal_googleAnalyticsEnabled_brief: () =>
    `Allow etoro-better-ui can use and analyze data of user-interface (it's doesn't collect your privacy data)`,
  universal_intervalCheckingStatus_brief: () =>
    `The status bar that including inferring delay and Trading Working Status on top of Execution Dialog, setting value as an interval to checking every N second. The short interval range would be consuming more CPU usage.`,
  universal_lever_text: () => 'Lever',
  universal_setup_text: () => 'Better UI Settings',
  universal_useKeyboardHotkeys_brief: () => (
    <React.Fragment>
      <Tooltip
        placement='left'
        overlay={'Will listen to Execution Dialog is open'}
      >
        <div>
          The Hotkey <HighlightText>TAB</HighlightText> to switch BUY or SELL.
        </div>
      </Tooltip>

      <Tooltip
        placement='left'
        overlay={'Will listen to Execution Dialog is open'}
      >
        <div>
          The Hotkey <HighlightText>Space</HighlightText> to trigger "Open
          Trade" immediately。
        </div>
      </Tooltip>

      <Tooltip placement='left' overlay={'Will listen to Dialogs are open'}>
        <div>
          The Hotkey <HighlightText>ESC</HighlightText> to close Dialogs.
        </div>
      </Tooltip>

      <Tooltip placement='left' overlay={'Will listen to Page Watch List'}>
        <div>
          The Hotkey <HighlightText>F</HighlightText> to get focus on filter
          input。
        </div>
      </Tooltip>
    </React.Fragment>
  ),
  universal_useKeyboardHotkeys_help: (openSettings: () => void) => {
    return (
      <React.Fragment>
        <span>
          You have not enabled the hotkey listeners, do you want to get it to
          enable?
          <PrimaryButton
            onClick={() => {
              openSettings()
            }}
          >
            Open Settings
          </PrimaryButton>{' '}
        </span>
      </React.Fragment>
    )
  },
  universal_welcomeMessage_text: (Link: React.FC) => {
    return (
      <React.Fragment>
        <HighlightText>Strong Recommended</HighlightText>: Install or update
        with a new version on holiday and have tried it on virtual mode before
        real trading.
      </React.Fragment>
    )
  },
}

export const i18n =
  (angularAPI.$rootScope?.session.locale?.includes('zh') && zh) || en
