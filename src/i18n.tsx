import * as React from 'react'
import { TooltipHighlightText } from '@/components/TooltipHighlightText'
import { angularAPI } from '@/angularAPI'

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
  dialog_buttonsSetup_brief: () => '下單巨集金額設定（請用逗號隔開數字）e.g. 100,200,300,500,1000',
  dialog_buttonsSetup_text: () => '設定',
  dialog_enabled_brief: () => `下單巨集輔助功能，此功能同時提供記憶你的上一次交易金額與槓桿`,
  dialog_fixedNextOrderValue_brief: () => '鎖定你每一次下單金額數字與槓桿倍率，此功能以你上一次點擊巨集按鈕為記錄點',
  dialog_fixedNextOrderValue_text: () => '金額槓桿鎖定',
  dialog_fixedNextOrderValueNot_text: () => '金額槓桿鎖定?',
  dialog_keyboardTabToBuySell_brief: () => '在下單視窗使用 Tab 鍵來切換「賣出」或「買入」',
  exchange_usedSetup_brief: (selectedText: string) => `設定幣別（當前：${selectedText}）`,
  filterText_clearText_text: () => '清除輸入',
  filterText_input_brief: () => (
    <span>
      {' '}
      使用 <TooltipHighlightText>Enter</TooltipHighlightText> 可以開啟第一個標的之下單框。使用 <TooltipHighlightText>Escape</TooltipHighlightText> 可以清除輸入框。{' '}
    </span>
  ),
  filterText_input_help: () => '過濾...',
  link_checkBalance_text: () => '餘額',
  link_deposit_text: (value: number) => `（${value}）銀行賣出`,
  link_donation_text: () => '贊助作者',
  link_extensionAuthor_text: () => '聯絡作者',
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
  link_withdrawExtra_text: (value: React.ReactNode) => <React.Fragment>（{value}）銀行買入</React.Fragment>,
  profits_availableValues_text: () => '可用餘額',
  profits_fixedStopLossValueOnOrder_brief: (lastPercent: number) => `每次下單視窗開啟時，套用上一次的止損趴數（上一次 ${lastPercent}%）`,
  profits_fixedTakeValueOnOrder_brief: (lastPercent: number) => `每次下單視窗開啟時，套用上一次的止盈趴數（上一次 ${lastPercent}%）`,
  profits_invested_brief: () => (
    <span>
      {' '}
      只顯示<TooltipHighlightText>已投資</TooltipHighlightText>的標的或投資者{' '}
    </span>
  ),
  profits_invested_text: () => '已投資',
  profits_selectedObjective_brief: (selected: string) => `${selected} 之開倉位當前利潤`,
  setting_resetAll_text: () => '重置所有設定',
  status_inferringDelay_text: () => `大概延遲`,
  universal_amount_text: () => '金額',
  universal_compact_brief: () => '不顯示關注列表中的無用介面（當前以開發者視角主觀認定）',
  universal_compact_text: () => '緊湊',
  universal_doAvoid_text: () => '動作沒有執行，可能介面不存在，或發生錯誤',
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
  universal_errorOnRender_text: (error: Error) => <span>錯誤：{error.message}</span>,
  universal_extensionName_text: () => 'eToro better UI',
  universal_extensionSupportName_text: (Link: React.FC) => {
    return (
      <span>
        {' '}
        本功能由 <Link /> 提供{' '}
      </span>
    )
  },
  universal_googleAnalyticsEnabled_brief: () => `允許 etoro-better-ui 能夠使用並分析，介面的操作情況 (這個功能不會收集您的隱私資料)`,
  universal_intervalCheckingStatus_brief: () => `在下單視窗上方的「推估延遲狀態」與「交易系統運作狀況」，設定每隔 N 秒重新整理；越短的檢查時間，會消耗更多的性能`,
  universal_lever_text: () => '槓桿',
  universal_setup_text: () => '設定',
  universal_welcomeMessage_text: (Link: React.FC) => {
    return (
      <React.Fragment>
        {' '}
        <span> 🙏 感謝您使用 {zh.universal_extensionName_text()} 更多資訊請恰詢： </span> <Link /> {zh.link_extensionWebsite_text()} 或是{' '}
        <a style={{ color: 'blue' }} target='_blank' href='https://t.me/etoro_better_ui'>
          {' '}
          telegram 群組{' '}
        </a>{' '}
      </React.Fragment>
    )
  },
}

const en: typeof zh = {
  dialog_buttonsSetup_brief: () => 'Trade value of the investment by one click, each number has to split by comma. e.g. 100,200,300,500,1000. Use Enter key to save.',
  dialog_buttonsSetup_text: () => 'Setup',
  dialog_enabled_brief: () => `Enable Execution Trade Macro, and it also memorizes your previously selected value of investment and lever value.`,
  dialog_fixedNextOrderValue_brief: () => `Always use the last Amount and Lever, which previously you click value of buttons.`,
  dialog_fixedNextOrderValue_text: () => 'Same Order',
  dialog_fixedNextOrderValueNot_text: () => 'Same Order?',
  dialog_keyboardTabToBuySell_brief: () => 'Use the Tab key to switch BUY or SELL, effect on Execution Dialog open.',
  exchange_usedSetup_brief: (selectedText: string) => `Currency（Now：${selectedText}）`,
  filterText_clearText_text: () => 'Remove Text',
  filterText_input_brief: () => (
    <span>
      {' '}
      Use the <TooltipHighlightText>Enter</TooltipHighlightText> key to open the first Execution Dialog. Use the <TooltipHighlightText>Escape</TooltipHighlightText> to clear the input .{' '}
    </span>
  ),
  filterText_input_help: () => 'Filter...',
  link_checkBalance_text: () => 'Balance',
  link_deposit_text: (value: number) => `（${value}）Sold`,
  link_donation_text: () => 'Donate',
  link_extensionAuthor_text: () => 'Contact Me',
  link_extensionWebsite_text: () => 'Website',
  link_pendingOrders_text: () => `Pending Orders`,
  link_portfolio_text: () => 'portfolio',
  link_riskKnown_text(Link: React.FC) {
    return (
      <span>
        {' '}
        This extension is not official. Make sure you know you have risk when using this extension. <Link />{' '}
      </span>
    )
  },
  link_withdrawExtra_text: (value: React.ReactNode) => <React.Fragment>（{value}）Buy</React.Fragment>,
  profits_availableValues_text: () => 'Available Value',
  profits_fixedStopLossValueOnOrder_brief: (lastPercent: number) => `When Execution-Dialog on render, it's applying the last percent of Stop-Loss (will apply ${lastPercent}%)`,
  profits_fixedTakeValueOnOrder_brief: (lastPercent: number) => `When Execution-Dialog on render, it's applying the last percent of Take-Profit (will apply ${lastPercent}%)`,
  profits_invested_brief: () => (
    <span>
      {' '}
      Display <TooltipHighlightText>invested</TooltipHighlightText> only. (people and instruments){' '}
    </span>
  ),
  profits_invested_text: () => 'Invested',
  profits_selectedObjective_brief: () => `Profits @ Positions on Current Dialog`,
  setting_resetAll_text: () => 'Reset All of Settings',
  status_inferringDelay_text: () => `Infer Delay`,
  universal_amount_text: () => 'Amount',
  universal_compact_brief: () => 'Do NOT display unnecessary UIs (proposed by author)',
  universal_compact_text: () => 'compact',
  universal_doAvoid_text: () => 'No Action Execution, Target not found or maybe somethings broken.',
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
  universal_errorOnRender_text: (error: Error) => <span>ERROR: {error.message}</span>,
  universal_extensionName_text: () => 'eToro better UI',
  universal_extensionSupportName_text: (Link: React.FC) => {
    return (
      <span>
        {' '}
        Support By <Link />{' '}
      </span>
    )
  },
  universal_googleAnalyticsEnabled_brief: () => `Allow etoro-better-ui can use and analyze data of user-interface (it's doesn't collect your privacy data)`,
  universal_intervalCheckingStatus_brief: () => `The status bar that including inferring delay and Trading Working Status on top of Execution Dialog, setting value as an interval to checking every N second. The short interval range would be consuming more CPU usage.`,
  universal_lever_text: () => 'Lever',
  universal_setup_text: () => 'Better UI Settings',
  universal_welcomeMessage_text: (Link: React.FC) => {
    return (
      <React.Fragment>
        {' '}
        <span>🙏 Thanks for install {en.universal_extensionName_text()}, for more information in </span> <Link /> {en.link_extensionWebsite_text()} or{' '}
        <a style={{ color: 'blue' }} target='_blank' href='https://t.me/etoro_better_ui'>
          {' '}
          telegram group{' '}
        </a>{' '}
      </React.Fragment>
    )
  },
}

export const i18n = (angularAPI.$rootScope.session.locale?.includes('zh') && zh) || en
