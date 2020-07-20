import * as React from 'react'
import { TooltipHighlightText } from '@/components/TooltipHighlightText'

const zh = {
  設定秒間隔讀取延遲及系統狀態: () =>
    `在下單視窗上方的「推估延遲狀態」與「交易系統運作狀況」，設定每隔 N 秒重新整理；越短的檢查時間，會消耗更多的性能`,
  設定允許使用谷歌分析: () =>
    `允許 etoro-better-ui 能夠使用並分析，介面的操作情況 (這個功能不會收集您的隱私資料)`,
  錯誤程式渲染時發生錯誤: (error: Error) => <span>錯誤：{error.message}</span>,
  下單框套用上次止損趴數之說明: (lastPercent: number) =>
    `每次下單視窗開啟時，套用上一次的止損趴數（上一次 ${lastPercent}%）`,
  下單框套用上次止盈趴數之說明: (lastPercent: number) =>
    `每次下單視窗開啟時，套用上一次的止盈趴數（上一次 ${lastPercent}%）`,
  左側欄出金按鈕: (value: number) => `（${value}）銀行買入`,
  清除篩選文字: () => '清除輸入',
  幫助作者: () => '贊助作者',
  當前可用餘額: () => '可用餘額',
  使下單視窗能夠單鍵快速切換買賣: () =>
    '在下單視窗使用 Tab 鍵來切換「賣出」或「買入」',
  使已投資顯示: () => '已投資',
  使已投資顯示之說明: () => (
    <span>
      只顯示<TooltipHighlightText>已投資</TooltipHighlightText>的標的或投資者
    </span>
  ),
  左下入金按鈕: (value: number) => `（${value}）銀行賣出`,
  使鎖定下單重複一致: () => '自動上次',
  使鎖定下單重複一致否定: () => '自動上次?',
  使鎖定下單重複一致之說明: () =>
    '始終以你上一次點擊巨集為基準，同步每次下單金額與槓桿',
  使緊湊: () => '緊湊',
  使緊湊之說明: () => '不顯示關注列表中的無用介面（當前以開發者視角主觀認定）',
  輸入以過濾提示窗說明: () => (
    <span>
      使用 <TooltipHighlightText>Enter</TooltipHighlightText>{' '}
      可以開啟第一個標的之下單框。使用{' '}
      <TooltipHighlightText>Escape</TooltipHighlightText> 可以清除輸入框。
    </span>
  ),
  輸入以過濾: () => '過濾...',
  腳本標題: () => 'eToro better UI',
  功能提供者述敘: (Link: React.FC) => {
    return (
      <span>
        本功能由 <Link /> 提供
      </span>
    )
  },
  腳本官網: () => '腳本官網',
  聯絡作者: () => '聯絡作者',
  風險說明書: () => '風險說明書',
  感謝使用提示語: (Link: React.FC) => {
    return (
      <React.Fragment>
        <span>🙏 感謝您使用 {zh.腳本標題()} 更多資訊請恰詢：</span>
        <Link /> {zh.腳本官網()} 或是{' '}
        <a
          style={{ color: 'blue' }}
          target='_blank'
          href='https://t.me/etoro_better_ui'
        >
          telegram 群組
        </a>
      </React.Fragment>
    )
  },
  設定重置所有設定: () => '重置所有設定',
  設定幣別: (selectedText: string) => `設定幣別（當前：${selectedText}）`,
  下單巨集設定按鈕: () => '設定',
  下單巨集啟用狀態: () =>
    `下單巨集輔助功能，此功能同時提供記憶你的上一次交易金額與槓桿`,
  下單巨集金額設定: () =>
    '下單巨集金額設定（請用逗號隔開數字）e.g. 100,200,300,500,1000',
  大概延遲: () => `大概延遲`,
  槓桿: () => '槓桿',
  金額: () => '金額',
  設定: () => '設定',
  餘額: () => '餘額',
  確保同意下單巨集風險: (Link: React.FC) => {
    return (
      <span>
        本程式非官方提供，請確保您知道使用風險 <Link />
      </span>
    )
  },
  投資組合: () => '投資組合',
  動作沒有執行: () => '動作沒有執行，可能介面不存在，或發生錯誤',
  設定變更中: () => '設定變更中...',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        設定已變更：
        <PostComponent />
      </span>
    )
  },
  設定未變更: (PostComponent: React.FC) => {
    return (
      <span>
        設定未變更：
        <PostComponent />
      </span>
    )
  },
}

const en: typeof zh = {
  設定秒間隔讀取延遲及系統狀態: () =>
    `The status bar that including inferring delay and Trading Working Status on top of Execution Dialog, setting value as an interval to checking every N second. The short interval range would be consuming more CPU usage.`,
  設定允許使用谷歌分析: () =>
    `Allow etoro-better-ui can use and analyze data of user-interface (it's doesn't collect your privacy data)`,
  錯誤程式渲染時發生錯誤: (error: Error) => <span>ERROR: {error.message}</span>,
  下單框套用上次止損趴數之說明: (lastPercent: number) =>
    `When Execution-Dialog on render, it's applying the last percent of Stop-Loss (will apply ${lastPercent}%)`,
  下單框套用上次止盈趴數之說明: (lastPercent: number) =>
    `When Execution-Dialog on render, it's applying the last percent of Take-Profit (will apply ${lastPercent}%)`,
  左側欄出金按鈕: (value: number) => `（${value}）Buy`,
  清除篩選文字: () => 'Remove Text',
  幫助作者: () => 'Donate',
  當前可用餘額: () => 'Available Value',
  使下單視窗能夠單鍵快速切換買賣: () =>
    'Use the Tab key to switch BUY or SELL, effect on Execution Dialog open.',
  使已投資顯示: () => 'Invested',
  使已投資顯示之說明: () => (
    <span>
      Display <TooltipHighlightText>invested</TooltipHighlightText> only.
      (people and instruments)
    </span>
  ),
  左下入金按鈕: (value: number) => `（${value}）Sold`,
  使鎖定下單重複一致: () => 'Same Order',
  使鎖定下單重複一致否定: () => 'Same Order?',
  使鎖定下單重複一致之說明: () =>
    'Always use the last Amount and Lever, which you previously selected value.',
  使緊湊: () => 'compact',
  使緊湊之說明: () => 'Do NOT display unnecessary UIs (proposed by author)',
  輸入以過濾提示窗說明: () => (
    <span>
      Use the <TooltipHighlightText>Enter</TooltipHighlightText> key to open the
      first Execution Dialog. Use the{' '}
      <TooltipHighlightText>Escape</TooltipHighlightText> to clear the input .
    </span>
  ),
  輸入以過濾: () => 'Filter...',
  腳本標題: () => 'eToro better UI',
  功能提供者述敘: (Link: React.FC) => {
    return (
      <span>
        Support By <Link />
      </span>
    )
  },
  腳本官網: () => 'Website',
  聯絡作者: () => 'Contact Me',
  風險說明書: () => 'Risk Agreement',
  感謝使用提示語: (Link: React.FC) => {
    return (
      <React.Fragment>
        <span>
          🙏 Thanks for install {en.腳本標題()}, for more information in{' '}
        </span>
        <Link /> {en.腳本官網()} or{' '}
        <a
          style={{ color: 'blue' }}
          target='_blank'
          href='https://t.me/etoro_better_ui'
        >
          telegram group
        </a>
      </React.Fragment>
    )
  },
  設定重置所有設定: () => 'Reset All of Settings',
  設定幣別: (selectedText: string) => `Currency（Now：${selectedText}）`,
  下單巨集設定按鈕: () => 'Setup',
  下單巨集啟用狀態: () =>
    `Enable Execution Trade Macro, and it also memorizes your previously selected value of investment and lever value.`,
  下單巨集金額設定: () =>
    'Trade value of the investment by one click, each number has to split by comma. e.g. 100,200,300,500,1000. Use Enter key to save.',
  大概延遲: () => `Infer Delay`,
  槓桿: () => 'Lever',
  金額: () => 'Amount',
  設定: () => 'Better UI Settings',
  餘額: () => 'Balance',
  確保同意下單巨集風險(Link: React.FC) {
    return (
      <span>
        This extension is not official. Make sure you know you have risk when
        using this extension. <Link />
      </span>
    )
  },
  投資組合: () => 'portfolio',
  動作沒有執行: () =>
    'No Action Execution, Target not found or maybe somethings broken.',
  設定變更中: () => 'loading...',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        Has been changed：
        <PostComponent />
      </span>
    )
  },
  設定未變更: (PostComponent: React.FC) => {
    return (
      <span>
        Nothing changes：
        <PostComponent />
      </span>
    )
  },
}

type EtoroLocale = 'en-gb' | 'zh-cn' | 'zh-tw'

const eToroLocale: EtoroLocale =
  (/eToroLocale=(?<eToroLocale>[\s\S]+?);/i.exec(globalThis.document.cookie)
    ?.groups?.eToroLocale as EtoroLocale) || 'zh-tw'

export const i18n = (eToroLocale.includes('zh') && zh) || en
