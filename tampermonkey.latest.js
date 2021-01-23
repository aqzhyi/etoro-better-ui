/**
 * 強烈建議您：先行開啟虛擬交易之後，再執行安裝，或更新版本；並在虛擬交易中，嘗試之後再應用於真實交易之上。
 *
 * Strong Recommended: Turn on the virtual mode at first, and install or update
 * with a new version, and make sure you have tried it in virtual mode before
 * real trading.
 *
 * Changelog: https://github.com/hilezir/etoro-better-ui/releases
 *
 * Website:
 * https://www.notion.so/hilezi/eToro-better-UI-day-trading-helper-enhancement--4fe69cd704434ff1b82f0cd48dd219c3
 */

// ==UserScript==
// @name            eToro Better UI 雲端自動更新版
// @name:en         eToro Better UI in Cloud
// @description     本套件不提供「自動程式交易」的功能，本套件的核心思想是在盡可能不破壞 eToro 的介面上，介入提升用戶體驗。因此你仍然應該由自己作主下單交易。100% 開源程式碼，免費安裝並使用。
// @description:en  An extension in order to improve Better UI/UX on the eToro system. 100% Open Source on Github can be inspected or verify, no worries.
// @version         0.37.0
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
// @connect         127.0.0.1
// @connect         localhost
// ==/UserScript==

// @ts-check

// 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼
// 如果你想切換版本的使用，可以參考下面這一行程式碼
// If you are looking for another version, please change the word to the your target
// 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼

try {
  // const url = `https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@${version}/dist/etoro.js`
  const url = `http://127.0.0.1:9000/dist/index.js`

  console.info('🔴 better-ui... loading...')

  window['GM_xmlhttpRequest']({
    url: url + `?${new Date().getTime()}`,
    onload: event => {
      console.info('🟡 better-ui... almost done...')
      eval(event.responseText)
      console.info('🟢 better-ui... has been loaded...')
    },
  })
} catch (error) {
  if (error && error.message) {
    alert(error.message)
  } else {
    alert(`Error: better-ui load failed, don't know why`)
  }
}
