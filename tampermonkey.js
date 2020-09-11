/**
  !! 強烈建議您：先行開啟虛擬交易之後，再執行安裝，或更新版本；並在虛擬交易中，嘗試之後再應用於真實交易之上。

  !! Strong Recommended: Turn on the virtual mode at first, and install or update with a new version,
    and make sure you have tried it in virtual mode before real trading.
*/

/** 更新日誌 Change Logs： https://github.com/hilezir/etoro-better-ui/releases */

// ==UserScript==
// @name            eToro Better UI
// @name:en         eToro Better UI
// @description     本套件不提供「自動程式交易」的功能，本套件的核心思想是在盡可能不破壞 eToro 的介面上，介入提升用戶體驗。因此你仍然應該由自己作主下單交易。100% 開源程式碼，免費安裝並使用。
// @description:en  An extension in order to improve Better UI/UX on the eToro system. 100% Open Source on Github can be inspected or verify, no worries.
// @version         0.33.0
// @author          hilezir
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @match           https://*.etoro.com/*
// @match           https://etoro.com/*
// @exclude         https://*.etoro.com/chat
// @exclude         https://*.etoro.com/chats
// @exclude         https://*.etoro.com/*/chat
// @exclude         https://*.etoro.com/*/chats
// @run-at          document-idle
// @noframes
// @namespace       http://tampermonkey.net/

///////////////////** 開源程式碼庫 */
// @connect         cdn.jsdelivr.net
// @connect         cdnjs.cloudflare.com

///////////////////** 台灣臺灣銀行 */
// @connect         bot.com.tw

///////////////////** 馬國大眾銀行 */
// @connect         www.pbebank.com

///////////////////** 本地開發專用 */
// !@connect        127.0.0.1
// ==/UserScript==

// @ts-check

// 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼
// 如果你想切換版本的使用，可以參考下面這一行程式碼
// If you are looking for another version, please change the word to the your target
//
// 當前以下版本可供切換：'latest' | 'nightly' | 'dev' | '0.33' | '0.32' | '0.31', etc
// target version available value are: 'latest' | 'nightly' | 'dev' | '0.33' | '0.32' | '0.31', etc
//
/** @type{version} */
const version = 'latest'
//
// 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼

try {
  const url = getBundleUrl(version)

  console.info('better-ui: loading...')

  addStylesheetTag({
    url: url.replace('.js', '.css'),
  })

  window['GM_xmlhttpRequest']({
    url: url,
    onload: event => {
      console.info('better-ui: loaded with', url)
      eval(event.responseText)
      console.info('better-ui: should up!')
    },
  })
} catch (error) {
  if (error && error.message) {
    alert(error.message)
  } else {
    alert(`Error: better-ui load failed, don't know why`)
  }
}

function getBundleUrl(
  /**
    @type{version}
    */
  targetVersion,
) {
  /**
    @type{
      Record<typeof targetVersion, { hash: string, filename: string }>
    }
  */
  const builds = {
    beta: { hash: 'master', filename: 'etoro' },
    nightly: { hash: 'master', filename: 'etoro' },
    latest: { hash: 'v0.33.0-20200911', filename: 'etoro' },
    0.33: { hash: 'v0.33.0-20200911', filename: 'etoro' },
    0.32: { hash: 'v0.32.4-20200907', filename: 'etoro' },
    0.31: { hash: 'v0.31.0-20200902', filename: 'etoro' },
    '0.30': { hash: 'v0.30.0-20200825', filename: 'etoro' },
    0.29: { hash: 'v0.29.0-20200825', filename: 'etoro' },
    0.28: { hash: 'v0.28.0-20200823-beta3', filename: 'etoro' },
    0.27: { hash: 'v0.27.0-20200730', filename: 'etoro' },
    0.26: { hash: 'v0.26.1-20200721', filename: 'etoro' },
    0.25: { hash: 'v0.25.3', filename: 'etoro' },
    0.24: { hash: 'v0.24.1', filename: 'etoro' },
    0.23: { hash: 'v0.23.1', filename: 'etoro' },
    dev: { hash: 'https://127.0.0.1:8087/etoro.js', filename: 'etoro' },
  }

  if (!builds[targetVersion]) {
    throw new Error('better-ui: target version not invalid')
  }

  const url = builds[targetVersion].hash.startsWith('http')
    ? builds[targetVersion].hash
    : `https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@${builds[targetVersion].hash}/dist/etoro.js` +
      `${targetVersion === 'nightly' ? `?time=${new Date().getTime()}` : ''}`

  return url
}

function addStylesheetTag(
  /**
    @type {{ url: string }}
  */
  options,
) {
  const head = globalThis.document.querySelector('head')
  const link = globalThis.document.createElement('link')
  link.href = options.url
  link.type = 'text/css'
  link.rel = 'stylesheet'

  head?.appendChild(link)
}

/* global globalThis */

/**
  @typedef { | 'latest' | 'beta' | 'nightly' | 'dev' | '0.33' | '0.32' | '0.31' | '0.30' | '0.29' | '0.28' | '0.27' | '0.26' | '0.25' | '0.24' | '0.23' | '0.23' } version
 */
