import * as React from 'react'

const zh = {
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
  感謝使用提示語(Link: React.FC) {
    return (
      <React.Fragment>
        <span>🙏 感謝您使用 {this.腳本標題} 更多資訊請恰詢：</span>
        <Link /> {this.腳本官網}
      </React.Fragment>
    )
  },
  設定幣別: (selectedText: string) => `設定幣別（當前：${selectedText}）`,
  下單巨集: enabled => `下單巨集（當前：${enabled ? '啟用' : '停用'}）`,
  巨集金額設定: () => '巨集金額設定',
  大概延遲: (msValue: number) => `大概延遲：${msValue}ms`,
  槓桿: () => '槓桿',
  金額: () => '金額',
  設定: () => '設定',
  餘額: () => '餘額',
  確保同意下單巨集風險: (Link: React.FC) => {
    return (
      <span>
        在使用 better-etoro-ui 所提供的下單巨集之前，請您確保您已閱讀 <Link />
        ，並你也表示同意。
      </span>
    )
  },
  投資組合: () => '投資組合',
  動作沒有執行: () => '動作沒有執行，因為發現可能的出錯',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        設定已變更：
        <PostComponent />
      </span>
    )
  },
}

const en: typeof zh = {
  腳本標題: () => 'eToro better UI',
  功能提供者述敘: (Link: React.FC) => {
    return (
      <span>
        Support By <Link />
      </span>
    )
  },
  腳本官網: () => 'Website',
  聯絡作者: () => 'Contact Developer',
  風險說明書: () => 'Risk Agreement',
  感謝使用提示語(Link: React.FC) {
    return (
      <React.Fragment>
        <span>
          🙏 Thanks for install {this.腳本標題}, for more information in{' '}
        </span>
        <Link /> {this.腳本官網()}
      </React.Fragment>
    )
  },
  設定幣別: (selectedText: string) => `Set Currency（Now：${selectedText}）`,
  下單巨集: enabled => `Macro（Now：${enabled ? 'enabled' : 'disabled'}）`,
  巨集金額設定: () => 'Order Macro Setting',
  大概延遲: (msValue: number) => `Infer Delay：${msValue}ms`,
  槓桿: () => 'Lever',
  金額: () => 'Amount',
  設定: () => 'Setting',
  餘額: () => 'Balance',
  確保同意下單巨集風險(Link: React.FC) {
    return (
      <span>
        Before use the Macro support by {this.腳本標題()}, Make sure you
        understand <Link />, and you must agree the possible risk.
      </span>
    )
  },
  投資組合: () => 'portfolio',
  動作沒有執行: () => 'No Action Execution, Seems Somethings broken.',
  設定已變更: (PostComponent: React.FC) => {
    return (
      <span>
        Setting Changed：
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
