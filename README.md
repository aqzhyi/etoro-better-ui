Better eToro UI
===
[![compiler: typescript](https://img.shields.io/badge/compiler-🏗%20TypeScript%20-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![i18n: i18n-ally](https://img.shields.io/badge/i18n-🌏%20i18n--ally-default.svg?style=flat-square&colorA=334a5d&colorB=70c9c7)](https://github.com/antfu/i18n-ally)
[![i18n: i18next](https://img.shields.io/badge/i18n-🌏%20i18next-default.svg?style=flat-square&colorA=334a5d&colorB=009789)](https://github.com/antfu/i18n-ally)
[![UI: react & redux](https://img.shields.io/badge/UI-🎨%20react%20&%20redux-blue.svg?style=flat-square)](https://github.com/facebook/react)
[![style: styled-components](https://img.shields.io/badge/style-💅styled--components-orange.svg?style=flat-square&colorA=db748e&colorB=daa357)](https://github.com/styled-components/styled-components)
[![UI: jQuery](https://img.shields.io/badge/UI-🎨%20jQuery-default.svg?style=flat-square&colorA=282c34&colorB=0769ad)](https://jquery.com/)
[![UI: angularjs](https://img.shields.io/badge/UI-🎨%20angularjs-default.svg?style=flat-square&colorA=282c34&colorB=a6120d)](https://angularjs.org/)

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

    ```ts
      // ==UserScript==
      // @name            Better etoro UI - Switch In Another Build
      // @version         0.0.0
      // @author          hilezir
      // @grant           GM_xmlhttpRequest
      // @grant           GM_addStyle
      // @match           https://*.etoro.com/*
      // @match           https://etoro.com/*
      // @exclude         https://*.etoro.com/chat/*
      // @exclude         https://*.etoro.com/chats/*
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
      // @connect        127.0.0.1
      // ==/UserScript==

      // @ts-check

      console.info('better-ui: loading...')

      try {
        // 🇹🇼🇹🇼🇹🇼🇹🇼🇹🇼
        // target version available value are: 'latest' | 'beta' | 'nightly' | '0.27' | '0.26' | '0.25' | '0.24' | '0.23', etc
        const url = getBundleUrl('dev')
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
    ```

    See more in [eToro-better-UI Switch in another build](https://www.notion.so/hilezi/eToro-better-UI-Switch-in-another-build-eb3b7842ae8e46d58d43b7bb3059b624)

1. make sure be enabled it script

## Deploy & Release

1. bump version string in package.json
2. `npm run build`
3. `git release v1.0.0`
4. [release](https://github.com/hilezir/etoro-better-ui/releases) on github
5. release on [greasyfork.org](https://greasyfork.org/zh-TW/scripts/400518/)

## Donation

https://www.notion.so/hilezi/ab484fc786bf44f8b19a017fdbe4a698
