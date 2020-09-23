/**
  !! 強烈建議您：先行開啟虛擬交易之後，再執行安裝，或更新版本；並在虛擬交易中，嘗試之後再應用於真實交易之上。

  !! Strong Recommended: Turn on the virtual mode at first, and install or update with a new version,
    and make sure you have tried it in virtual mode before real trading.
*/

/** 更新日誌 Change Logs： https://github.com/hilezir/etoro-better-ui/releases */

// ==UserScript==
// @name            eToro Better UI Beta (Nightly)
// @name:en         eToro Better UI Beta (Nightly)
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

try {
  const url = `https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@master/dist/etoro.js`

  console.info('better-ui: loading...')

  window['GM_xmlhttpRequest']({
    url: url,
    onload: event => {
      console.info('better-ui: loaded with Beta (Nightly)', url)
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
