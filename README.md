Better eToro UI
===
[![compiler: typescript](https://img.shields.io/badge/compiler-🏗%20TypeScript%20-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![i18n: i18n-ally](https://img.shields.io/badge/i18n-🌏%20i18n--ally-default.svg?style=flat-square&colorA=334a5d&colorB=70c9c7)](https://github.com/antfu/i18n-ally)
[![i18n: i18next](https://img.shields.io/badge/i18n-🌏%20i18next-default.svg?style=flat-square&colorA=334a5d&colorB=009789)](https://www.i18next.com/)
[![UI: react & redux](https://img.shields.io/badge/UI-🎨%20react%20&%20redux-blue.svg?style=flat-square)](https://github.com/facebook/react)
[![style: emotion.sh](https://img.shields.io/badge/style-💅%20emotion/react-orange.svg?style=flat-square&colorA=db748e&colorB=daa357)](https://emotion.sh/docs/introduction)
[![code style: prettier](https://img.shields.io/badge/code_style-💅%20prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![UI: jQuery](https://img.shields.io/badge/UI-🎨%20jQuery-default.svg?style=flat-square&colorA=282c34&colorB=0769ad)](https://jquery.com/)
[![UI: angularjs](https://img.shields.io/badge/UI-🎨%20angularjs-default.svg?style=flat-square&colorA=282c34&colorB=a6120d)](https://angularjs.org/)

---

## An extension, plugin and helper in Chrome, Firefox, and Edge built for the eToro website and available in Tampermonkey.

Please note that I am not an eToro employee; this is personal side-project; it is not official. I use the react and typescript to built that, and it's based on eToro front-end UI if you want to try this project on your trading please see [THIS LINK](https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3), and make sure you know that risks.

---

> requirement: [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW)

## Trading Preview

[![image loading...](./SELL_ETORO_X100.gif)](https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3)

[![image loading...](./Kapture%202020-09-20%20at%2014.18.44.gif)](https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3)


## Development

1. Install [Tampermonkey Extension to your Chrome, Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW) or [Extension in Firefox](https://addons.mozilla.org/zh-TW/firefox/addon/tampermonkey/).
1. One terminal session for `npm run dev`
1. add new script that code [./tamperscript.js] to your tampermonkey or install it from [greasyfork](https://greasyfork.org/zh-TW/scripts/400518-etoro-better-ui)

    if you're looking for how multiple etoro-better-UI scripts to exist, visit [eToro-better-UI Switch in another build](https://www.notion.so/hilezi/eToro-better-UI-Switch-in-another-build-eb3b7842ae8e46d58d43b7bb3059b624)

1. make sure be enabled it script

## Deploy & Release

1. bump version string in package.json and [./tamperscript.js]
2. TODO: (now with some issues) ~~`npm run build`~~
3. `git release v1.0.0`
4. [release](https://github.com/hilezir/etoro-better-ui/releases) on github
5. release on [greasyfork.org](https://greasyfork.org/zh-TW/scripts/400518/)

## About

- [💬 UI Feedback](https://t.me/etoro_better_ui) in Telegram 🛩

- [💬 Contact](https://t.me/whatisclown)  in Telegram 🛩

- [💰 Donation](https://www.notion.so/hilezi/ab484fc786bf44f8b19a017fdbe4a698)

[./tamperscript.js]: https://github.com/hilezir/etoro-better-ui/blob/master/tampermonkey.js
