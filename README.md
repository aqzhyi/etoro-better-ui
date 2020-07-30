Better eToro UI
===
---
> A UI extension for the [#etoro](https://twitter.com/search?q=%23etoro&src=typed_query) site, it's 100% open-source and built with [#TypeScript](https://twitter.com/search?q=%23typescript&src=typed_query). Free to install and usage, it's many functions providers that you may need. More function preview on videos feels free to discover on our extension website.
---

> requirement: [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW)

## Preview

![](./extension-preview.gif)

## More information

> https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3

## Contact me

via telegram group https://t.me/etoro_better_ui

via telegram personal https://t.me/whatisclown

## Development

1. one terminal session for `npm run server`
1. one terminal session for `npm run dev`
1. add new script in tempermonkey with
    ```js
      // ==UserScript==
      // @name          Better etoro UI for Developer
      // @description   提供你更好的 etoro 新台幣介面增強懶人包
      // @version       0.1.0
      // @author        hilezir
      // @grant         GM_xmlhttpRequest
      // @grant         GM_addStyle
      // @grant         unsafeWindow
      // @match         https://*.etoro.com/*
      // @match         https://etoro.com/*
      // @run-at        document-idle
      // @noframes
      // @namespace     http://tampermonkey.net/

      // Xrequire       https://www.googletagmanager.com/gtag/js?id=UA-60395189-2
      // Xconnect       www.googletagmanager.com
      // Xconnect       www.google-analytics.com

      ///////////////////** 開源程式碼庫 */
      // @connect       cdn.jsdelivr.net
      // @connect       cdnjs.cloudflare.com

      ///////////////////** 台灣臺灣銀行 */
      // @connect       bot.com.tw

      ///////////////////** 馬國大眾銀行 */
      // @connect       www.pbebank.com

      ///////////////////** 本地開發專用 */
      // @connect       127.0.0.1
      // ==/UserScript==

      console.info('loading... etoro-better-ui')

      window.GM_xmlhttpRequest({
        url: 'http://127.0.0.1:8087/etoro.bundle.js?' + new Date().getTime(), // 開發模式
        // url: 'https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@v0.5.0/src_dist/etoro.bundle.js',
        onload: event => {
          eval(event.responseText)
        },
      })
    ```
1. make sure be enabled it script

## Deploy & Release

1. bump version string in package.json
2. `npm run build`
3. `git release v1.0.0`
4. [release](https://github.com/hilezir/etoro-better-ui/releases) on github
5. release on [greasyfork.org](https://greasyfork.org/zh-TW/scripts/400518/)

## Donation

> I'd appreciate any donation you could give me.

https://www.notion.so/hilezi/ab484fc786bf44f8b19a017fdbe4a698
