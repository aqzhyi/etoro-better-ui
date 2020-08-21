/**
  !! 強烈建議您：先行開啟虛擬交易之後，再執行安裝，或更新版本；並在虛擬交易中，嘗試之後再應用於真實交易之上。

  !! Strong Recommended: Turn on the virtual mode at first, and install or update with a new version, and make sure you have tried it in virtual mode before real trading.
*/

/** 更新日誌 Change Logs： https://github.com/hilezir/etoro-better-ui/releases */

// ==UserScript==
// @name            Better etoro UI for Developer
// @version         0.0.0
// @author          hilezir
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @match           https://*.etoro.com/*
// @match           https://etoro.com/*
// @exclude         https://*.etoro.com/chat/*
// @exclude         https://*.etoro.com/chats/*
// @exclude         https://*.etoro.com/*/chat/*
// @exclude         https://*.etoro.com/*/chats/*
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

console.info('better-ui: loading...')

try {
  // 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼
  // target version available value are: 'latest' | 'beta' | 'nightly' | '0.26' | '0.25' | '0.24' | '0.23', etc
  const url = getBundleUrl('beta')
  // ------------------------------------------------------------------------------------------------

  window['GM_xmlhttpRequest']({
    url: url,
    onload: event => {
      console.info('better-ui: loaded...')
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
    @type{ | 'latest' | 'beta' | 'nightly' | 'dev' | '0.27' | '0.26' | '0.25' | '0.24' | '0.23' | '0.23' }
    */
  targetVersion,
) {
  /**
    @type{
      Record<typeof targetVersion, { hash: string, filename: string }>
    }
  */
  const builds = {
    beta: { hash: 'v0.28.0-20200820-beta', filename: 'etoro' },
    dev: { hash: 'http://127.0.0.1:8087/etoro.bundle.js', filename: 'etoro' },
    nightly: { hash: 'master', filename: 'etoro' },
    latest: { hash: 'v0.27.0-20200730', filename: 'etoro' },
    '0.27': { hash: 'v0.27.0-20200730', filename: 'etoro' },
    '0.26': { hash: 'v0.26.1-20200721', filename: 'etoro' },
    '0.25': { hash: 'v0.25.3', filename: 'etoro' },
    '0.24': { hash: 'v0.24.1', filename: 'etoro' },
    '0.23': { hash: 'v0.23.1', filename: 'etoro' },
  }

  if (!builds[targetVersion]) {
    throw new Error('better-ui: target version not invalid')
  }

  const url = builds[targetVersion].hash.startsWith('http')
    ? builds[targetVersion].hash
    : `https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@${builds[targetVersion].hash}/src_dist/etoro.bundle.js` +
      `${targetVersion === 'nightly' ? `?time=${new Date().getTime()}` : ''}`

  return url
}
