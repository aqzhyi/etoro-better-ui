# [0.39.0-20210129](https://github.com/hilezir/etoro-better-ui/compare/v0.38.0-20210127...v0.39.0-20210129) (2021-01-29)


### Bug Fixes

* **TradeDialog:** fix unexpected float points rendering ([5c00c13](https://github.com/hilezir/etoro-better-ui/commit/5c00c131cab108a44295009ce7c923e886543801))


### Features

* **PositionCloseDialog:** space able to trigger the button of close position ([b0f5edf](https://github.com/hilezir/etoro-better-ui/commit/b0f5edfe65465dc84328bc4ad55b959ae1759b99))
* **TradeDialog:** add points of far to lost ([9be527a](https://github.com/hilezir/etoro-better-ui/commit/9be527a0fa8404d9263178e86a7a26477893dac1))
* **TradeDialog:** also show the value of points which your TP for win ([358ed0f](https://github.com/hilezir/etoro-better-ui/commit/358ed0f3325fa4bd635843a6c74f272933f96468))



# [0.38.0-20210127](https://github.com/hilezir/etoro-better-ui/compare/v0.38.0-20210124.beta...v0.38.0-20210127) (2021-01-26)


### Bug Fixes

* **Sidebar:** move down one level for the items of etoro-better-ui ([897683e](https://github.com/hilezir/etoro-better-ui/commit/897683eb47fce1c4b41af3ee369b95168b30cda4))
* **TradeDialog:** it show the prices when open OpenPositionDialog and EditPositionDialog ([b35c566](https://github.com/hilezir/etoro-better-ui/commit/b35c56649257bdcbe50eac23ac233efc4ff987b7))
* **TradeDialog:** now show the changes points, not the value of number of subtraction, it align to etoro ([9e8d1d8](https://github.com/hilezir/etoro-better-ui/commit/9e8d1d8172d39a8ef0a2cb05a93b03c0150be7fe))
* deps packages has been upgraded ([b7f2b32](https://github.com/hilezir/etoro-better-ui/commit/b7f2b325350038e5fad7d92f58146ec03f1ac904))



# [0.38.0-20210124.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.38.0-20210123.beta...v0.38.0-20210124.beta) (2021-01-23)


### Bug Fixes

* **SetupDialog:** faster to open ([66949a3](https://github.com/hilezir/etoro-better-ui/commit/66949a39af7dece1b5dcc6994e76a66072a8d5e8))
* **TradingSystemConnection:** add check the status of network ([d5aaa49](https://github.com/hilezir/etoro-better-ui/commit/d5aaa490d43acbe4bb8146e1abf77183f5658e5d))
* re-org the word for "experimental" to "bidask" ([496e675](https://github.com/hilezir/etoro-better-ui/commit/496e6756c11b521c363aa533764008ef6072dd6c))
* reduce the bundled size ([9c4a4b9](https://github.com/hilezir/etoro-better-ui/commit/9c4a4b988c403c529cdd1e753bd05ad367761fd0))
* sidebar items in etoro-better-ui, now elevate to the first class in etoro menu, since the newer always doesn't find the setup ([a65f086](https://github.com/hilezir/etoro-better-ui/commit/a65f0862bef27e6a7f235bbfe0d79ed3b9db3844))
* the hotkey "space" now defaults to enabled ([899c6b7](https://github.com/hilezir/etoro-better-ui/commit/899c6b7ea070081a207230f3985b003440c8479a))
* watch list no longer provider extra buttons, since it's seems bugs when route changed ([7b5e4ae](https://github.com/hilezir/etoro-better-ui/commit/7b5e4ae943807d7ec44264108af6c74af85c081f))
* **Trading:** fix the indicator of the Trading System Connection, since when script of etoro-better-ui load slowly, it will not be work correctly ([0f9d032](https://github.com/hilezir/etoro-better-ui/commit/0f9d032c87ade01c5b629957c409b3535e6710e9))


### Features

* see more button, now auto click only for once ([55d7fda](https://github.com/hilezir/etoro-better-ui/commit/55d7fda89bf3dc7e614799885dabcc1334a9aeb3))



# [0.38.0-20210123.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.38.0-20210116.beta...v0.38.0-20210123.beta) (2021-01-23)


### Bug Fixes

* **TradeDialog:** add missing precision of FX ([42def12](https://github.com/hilezir/etoro-better-ui/commit/42def128e67644bdbd2299030aa1791951cc57b6))


### Features

* **TradeDialog:** now will show the point count for the TP and SL ([149b4f4](https://github.com/hilezir/etoro-better-ui/commit/149b4f46e4e73a12f31bd32165a999960594fd51))
* **Trading:** sometimes the etoro not able to open the TradeDialog, add this indicators, so people can be know that system has been connected ([aa36feb](https://github.com/hilezir/etoro-better-ui/commit/aa36feb4b147cf119d22cb60023cdb86b5601ca1))



# [0.38.0-20210116.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.37.0-20201018...v0.38.0-20210116.beta) (2021-01-15)


### Features

* notifications; now show on top-right, was bottom-left, so the value of balance are clear ([ec810c7](https://github.com/hilezir/etoro-better-ui/commit/ec810c7034f0630edb70539c483d3be8db91e360))
* TradeDialog; add value of spread for each instrument ([798d281](https://github.com/hilezir/etoro-better-ui/commit/798d28168b909c84b70545c1abf38e5d430ff8c3))
* **TradeDashboard:** add the Link, can redirect to the page of portfolio of etoro ([97cee94](https://github.com/hilezir/etoro-better-ui/commit/97cee94f0d13e059e9fcf184dfbec198c974cfe7))
* **TradeDialog:** background no longer colour deep, so you can see your positions clearly on TradeDashboard when TradeDialog is open ([3157655](https://github.com/hilezir/etoro-better-ui/commit/3157655b9acb937c32c6854bc3f0a8cdadd5b925))



# [0.37.0-20201018](https://github.com/hilezir/etoro-better-ui/compare/v0.37.0-20201002.beta...v0.37.0-20201018) (2020-10-17)



# [0.37.0-20201002.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.37.0-20201001.beta...v0.37.0-20201002.beta) (2020-10-02)


### Features

* **TradeDashboard:** the button of close, will show the good information for the position ([67de5fc](https://github.com/hilezir/etoro-better-ui/commit/67de5fc1f256d04e472e8271dc4dc5e07480ebda))



# [0.37.0-20201001.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.36.0-20200926...v0.37.0-20201001.beta) (2020-10-01)


### Bug Fixes

* **TradeDashboard:** on evert route has changes, should close the dashboard, better UX ([9d7b76c](https://github.com/hilezir/etoro-better-ui/commit/9d7b76cf5f3adf81f6b7abb3f5b2f961f91793aa))


### Features

* **TradeDialog:** add the brief of positions for your current instrument trade, TP and SL also shown ([57f3bba](https://github.com/hilezir/etoro-better-ui/commit/57f3bbac36c0612ec9754c76568823c6c8131479))



# [0.36.0-20200926](https://github.com/hilezir/etoro-better-ui/compare/v0.36.0-20200923.beta...v0.36.0-20200926) (2020-09-26)



# [0.36.0-20200923.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.35.0-20200921...v0.36.0-20200923.beta) (2020-09-23)


### Bug Fixes

* **TradeDashboard:** missing marker re-open subscrition ([4193740](https://github.com/hilezir/etoro-better-ui/commit/419374054c595cf4eec9e72507194b2d28a2fe32))


### Features

* **TradeDialog:** the hotkey F and T can set the trade mode to the "Order" and "Trade" ([5dfd6d7](https://github.com/hilezir/etoro-better-ui/commit/5dfd6d72d69cdddde869e3f2ff5484bc5ef05aa4))



# [0.35.0-20200921](https://github.com/hilezir/etoro-better-ui/compare/v0.35.0-20200917...v0.35.0-20200921) (2020-09-20)


### Features

* **defaultSetup:** refactor code, changes defaults, to enabled useful setups by defaults ([9e08c7a](https://github.com/hilezir/etoro-better-ui/commit/9e08c7abb52f6c810f926940cb0084a12394aafd))
* **TradeDashboard:** better UI, better performance for update positions details ([ec3d89b](https://github.com/hilezir/etoro-better-ui/commit/ec3d89b5c6dfecbb887cf7cdb10a79e338bed2ed))
* **TradeDashboard:** if market is close, an icon to show to user, hide close button ([81c8614](https://github.com/hilezir/etoro-better-ui/commit/81c8614785c3440105fa365903ffe56a1ad1d495))



# [0.35.0-20200917](https://github.com/hilezir/etoro-better-ui/compare/v0.34.1-20200914...v0.35.0-20200917) (2020-09-16)


### Bug Fixes

* **hotkey:** when user intend to post or reply to somebody, which is users are focusing on a textarea or input ([c053681](https://github.com/hilezir/etoro-better-ui/commit/c0536811de2bd585739f99bb9d2be9ff67989849))


### Features

* **demoMode:** blur your etoro ID and balance amount, useful if you want to go to live stream or demo to somebody ([58f0cc6](https://github.com/hilezir/etoro-better-ui/commit/58f0cc6b2032b4563ace2c4451d76af7d20aafe3))
* **TradeDialog:** avoid TP/SL causes crashes, which means the function of toggle TP/SL has re-design ([3198e64](https://github.com/hilezir/etoro-better-ui/commit/3198e6404f6ad04254a49dbfd794f6d0bf1aa178))



## [0.34.1-20200914](https://github.com/hilezir/etoro-better-ui/compare/v0.34.0-20200912...v0.34.1-20200914) (2020-09-13)


### Bug Fixes

* **WatchlistHeader:** unexpected hotkey F can't trigger focus for filter input ([f83867e](https://github.com/hilezir/etoro-better-ui/commit/f83867edbfce76a16ad087ebe04921dc2ccd1c71))



# [0.34.0-20200912](https://github.com/hilezir/etoro-better-ui/compare/v0.33.0-20200911...v0.34.0-20200912) (2020-09-12)


### Features

* **Key12345:** also enable hotkey in page of portfolio/{NAME} ([8ed9b00](https://github.com/hilezir/etoro-better-ui/commit/8ed9b00e9cbbcb35ac02675e7a5a104664d8a4e0))
* **NativeTradeDialog:** hotkeys Q and E can use in the position editing dialog ([cd1fba4](https://github.com/hilezir/etoro-better-ui/commit/cd1fba4ffca4aaa1c7da80e0c44f2f817352d442))



# [0.33.0-20200911](https://github.com/hilezir/etoro-better-ui/compare/v0.32.4-20200907...v0.33.0-20200911) (2020-09-11)


### Features

* **NativeTradeDialog:** hotkeys Q and E can use to switching for the no SL and no TP so on ([5bd8fd8](https://github.com/hilezir/etoro-better-ui/commit/5bd8fd8a4499a4c022c274ac30aceb7092dd693b))
* **Settings:** users can use global hotkey "S" to open settings dialog of etoro-better-ui ([de387aa](https://github.com/hilezir/etoro-better-ui/commit/de387aa29bf06fb8492b8fb4e339db90349b77c4))
* **TradeDashboard:** bigger font size ([9643ead](https://github.com/hilezir/etoro-better-ui/commit/9643eadaabfa2199c4b75cfbb0e8d4b8a0d99a28))
* **TradeDashboard:** click the ICON, you can redirect to page for portfolio and the page for markets ([078d035](https://github.com/hilezir/etoro-better-ui/commit/078d035d3b81b850ecbdad3432b22401ac11632d))
* **TradeDashboard:** revert to the version which Headers should display ([cf785f5](https://github.com/hilezir/etoro-better-ui/commit/cf785f5afae9f0bc67489b86912ad77b9a98fe1c))
* **TradeDashboard:** show the information for SL/TP display in percents ([ac3a759](https://github.com/hilezir/etoro-better-ui/commit/ac3a7597b8d4add5db92250397d57075fddf8078))
* **TradeDashboard:** the button for close position, make UI response faster ([127e5f9](https://github.com/hilezir/etoro-better-ui/commit/127e5f9b922608b63de4d6d8df8807ded6008b9d))
* **TradeDashboard:** your new positions always on top ([ac95097](https://github.com/hilezir/etoro-better-ui/commit/ac95097f749d473275280ec8fcf7c4e68f9e4f30))



## [0.32.4-20200907](https://github.com/hilezir/etoro-better-ui/compare/v0.32.2-20200907...v0.32.4-20200907) (2020-09-08)


### Features

* **TradeDashboard:** closing positions should not change the layout of the position, improve users closing speed without mistakenly clicks ([f27254a](https://github.com/hilezir/etoro-better-ui/commit/f27254a8a34c7d7f1a88f34badb342c977c4450b))



## [0.32.2-20200907](https://github.com/hilezir/etoro-better-ui/compare/v0.32.1-20200907...v0.32.2-20200907) (2020-09-07)



## [0.32.1-20200907](https://github.com/hilezir/etoro-better-ui/compare/v0.32.0-20200904...v0.32.1-20200907) (2020-09-07)


### Bug Fixes

* **WatchlistFilter:** avoid F key unexpected to focus input when user typing in the input on the head nav ([68ab97e](https://github.com/hilezir/etoro-better-ui/commit/68ab97e92e861c3a77b1d8f0b215bb80fb930407))



# [0.32.0-20200904](https://github.com/hilezir/etoro-better-ui/compare/v0.31.0-20200902...v0.32.0-20200904) (2020-09-03)


### Bug Fixes

* **NativeTradeDialog:** render the lever buttons with better performance on etoro trade dialog ([ea27574](https://github.com/hilezir/etoro-better-ui/commit/ea27574f1d28e537dd536b205a66e1c01723bb02))


### Features

* **infra:** the hotkeys 1,2,3,4,5 let you open the trade dialog quickly, defaults disable ([4c41ba2](https://github.com/hilezir/etoro-better-ui/commit/4c41ba26beae9294ad47dacdaf943a79c0526030))
* **NativeTradeDialog:** hotkeys 1~5 and F1~F4 to set up amount or leverage quickly ([19e8ea6](https://github.com/hilezir/etoro-better-ui/commit/19e8ea662df5e443c2c11bb7532581545901be6e))



# [0.31.0-20200902](https://github.com/hilezir/etoro-better-ui/compare/v0.31.0-20200831...v0.31.0-20200902) (2020-09-01)


### Bug Fixes

* **TradeDashboard:** you can see the notification list when dashboard is open ([8a9df3d](https://github.com/hilezir/etoro-better-ui/commit/8a9df3d537f867cf89fbad769b3ec1e9454889f3))


### Features

* **TradeDashboard:** inferring delay now display ([233dc5e](https://github.com/hilezir/etoro-better-ui/commit/233dc5ebbe67b0c6e7c0207b2f64e13b65205167))
* **TradeDashboard:** paint instruments with the grayscale when is not able to trade (e.g. market closed) ([7342a51](https://github.com/hilezir/etoro-better-ui/commit/7342a5173f87c9d3e300b342efd759701e2fd24b))
* **TradeDashboard:** you can see "Manual trading - Real" status on dashboard ([f8f347e](https://github.com/hilezir/etoro-better-ui/commit/f8f347e5d3db61c51d0126d217c4c719bb98f9df))



# [0.31.0-20200831](https://github.com/hilezir/etoro-better-ui/compare/v0.31.0-20200830.beta...v0.31.0-20200831) (2020-08-31)



# [0.31.0-20200830.beta](https://github.com/hilezir/etoro-better-ui/compare/v0.30.0-20200825...v0.31.0-20200830.beta) (2020-08-30)


### Features

* **TradeDashboard:** improve functionality, performance, and avoid crash when closing positions quickly ([d9783a2](https://github.com/hilezir/etoro-better-ui/commit/d9783a210319821bd29b9d22fcfa3b27d9dc647d))
* new UI layout, the material-ui, retire the fluent-ui ([d295048](https://github.com/hilezir/etoro-better-ui/commit/d295048307381bd6b7b9cf1ba62223047b1ab4fb))
* remove Filter Function in portfolio and history, since no user have used it ([fdb53ad](https://github.com/hilezir/etoro-better-ui/commit/fdb53ad5fc9d0cc26dc74c5ef84ff671264b4561))
* Trade Dashboard, now has a slider, so you can adjust the re-render speed rate ([0b31e9d](https://github.com/hilezir/etoro-better-ui/commit/0b31e9d549ab23e176b62ae8ecf0de7d0c58e506))



# [0.30.0-20200825](https://github.com/hilezir/etoro-better-ui/compare/v0.29.0-20200825...v0.30.0-20200825) (2020-08-25)


### Features

* hotkey T when on watchlist page, able to open the trade dialog that on first, useful when you are filtering goods ([23785e3](https://github.com/hilezir/etoro-better-ui/commit/23785e3eae36376c8ea82245735fcc64e839848d))



# [0.29.0-20200825](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200823...v0.29.0-20200825) (2020-08-25)


### Features

* highlight Trade Buttons that one you selected ([1e4cb36](https://github.com/hilezir/etoro-better-ui/commit/1e4cb369fb84f1d18cee1e666de5e4827e083efc))
* hotkey D can open Trade Dashboard view ([5283f1e](https://github.com/hilezir/etoro-better-ui/commit/5283f1e8c8acef28b2dbe330dca7b9a6bd14cb80))
* the function of Amount Fixed should accept with the lever, for example, 200x5, 500x2, etc. when the min position is 1000 ([cf32922](https://github.com/hilezir/etoro-better-ui/commit/cf3292248cb157445c1c28f0bd3da03296ace5c9))
* Trade Dashboard, response when use click close ([2b6803b](https://github.com/hilezir/etoro-better-ui/commit/2b6803b231685e6a4df8baf1b64851e1dcd8a2ea))



# [0.28.0-20200823](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200823-beta3...v0.28.0-20200823) (2020-08-23)



# [0.28.0-20200823-beta3](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200823-beta2...v0.28.0-20200823-beta3) (2020-08-23)


### Features

* Trade Dashboard, early access ([1861de2](https://github.com/hilezir/etoro-better-ui/commit/1861de28c7240c6d73ff35d64098067b7aee270a))



# [0.28.0-20200822-beta](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200820-beta...v0.28.0-20200822-beta) (2020-08-21)



# [0.28.0-20200820-beta](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200807-beta...v0.28.0-20200820-beta) (2020-08-19)


### Bug Fixes

* cause an unexpected overriding in subscription of ping interval ([6270c62](https://github.com/hilezir/etoro-better-ui/commit/6270c6294ea6b4cbedd11a62df9fd84dac623f81))
* sometimes the fixed amount and leverages (if it Fixed enabled) couldn't apply correctly when each the dialog open ([ac84c96](https://github.com/hilezir/etoro-better-ui/commit/ac84c962f51f025b37db1b349184d154c7308b35))
* the trade dialog features cause other layout broken in "app/procharts" ([d0d5e60](https://github.com/hilezir/etoro-better-ui/commit/d0d5e60139da60b3a860f2833ddcb6dbe4732a4b))
* UI layout unexpected tiny moved on ExecutionDialogStatusInfo, [#5](https://github.com/hilezir/etoro-better-ui/issues/5) ([2fd1a9a](https://github.com/hilezir/etoro-better-ui/commit/2fd1a9af8cfb9e4a75025b6fb20b2de9f0fc0aa7))


### Features

* amount steppers and lever buttons on etoro native should work fine together when Amount/Lever Fixed enable ([2e76a5f](https://github.com/hilezir/etoro-better-ui/commit/2e76a5f6a1a090e3d24dfa7aea309fe7cbdcc220))
* more conspicuous with Buy and Sell Buttons ([45954a9](https://github.com/hilezir/etoro-better-ui/commit/45954a995c5300121d2dd18591667df932010199))
* the compact switch, now show chart, hide rate changes ([046ebbc](https://github.com/hilezir/etoro-better-ui/commit/046ebbcad303481efee61a424a529eab62269b52))
* when Trade Execution-Dialog on mount, it's applying percent of Stop-Loss and TakeProfit ([1329f8a](https://github.com/hilezir/etoro-better-ui/commit/1329f8aeccad19e16132e1b4f3f681ebb0c25e76))



# [0.28.0-20200807-beta](https://github.com/hilezir/etoro-better-ui/compare/v0.28.0-20200805-beta...v0.28.0-20200807-beta) (2020-08-07)


### Bug Fixes

* lever can't memorize correctly ([504b111](https://github.com/hilezir/etoro-better-ui/commit/504b111f165ba00aea2ba54d3daaf567c9ec3ab1))
* the amount and lever with automatic apply on the dialog with such as TLT, VTI, SQQQ, and QQQ doesn't work ([937544a](https://github.com/hilezir/etoro-better-ui/commit/937544adc7e7ebd9115359d2160fb7ba76d7293e))
* the stepper on the side of input that now memorizes the input values ([fb60924](https://github.com/hilezir/etoro-better-ui/commit/fb609240badd5def1ec2ac2d56c9452200e9000c))
* too many auto-click on "see more", will cause the next query to get rejected ([7a93677](https://github.com/hilezir/etoro-better-ui/commit/7a936770eef9dfc4450b19c0a327ea2811617690))


### Features

* price of Buy and Sell on dialog, display on buttons, re-render faster on each 50ms ([ff19dae](https://github.com/hilezir/etoro-better-ui/commit/ff19daefad97a7ebe8f6b1c5490bbfbff3795691))



# [0.28.0-20200805-beta](https://github.com/hilezir/etoro-better-ui/compare/v0.27.0-20200730...v0.28.0-20200805-beta) (2020-08-05)


### Bug Fixes

* dialog sometime didn't apply fixed amount/lever, improve it ([452017f](https://github.com/hilezir/etoro-better-ui/commit/452017f670a47e68eddf916ddd2fde2bfe42a66d))
* ExecutionDialogStatus error on render, can't read Name of instrument is undefined ([2fcf53f](https://github.com/hilezir/etoro-better-ui/commit/2fcf53fce0751433dfdaf136d6715ececec94098))
* positions profits on dialog, throw read of undefined ([a434709](https://github.com/hilezir/etoro-better-ui/commit/a434709201842ca7e991111d57fc44994c6e96e4))
* when dialog use TAB key, don't switch when users are focus on inputting the amount ([a446d40](https://github.com/hilezir/etoro-better-ui/commit/a446d40843dd2faa35c691b7804873d989427a53))


### Features

* hotkeys can set up with separate. After this version update, all hotkeys have reset in the disabled. Please enable it in settings. ([0ddf037](https://github.com/hilezir/etoro-better-ui/commit/0ddf0379f253fe8baa446c79ba269c761ea27ccb))
* if hotkeys enabled, tooltips shown on the targets. and prevent trigger hotkey when users focus on inputs. ([655012f](https://github.com/hilezir/etoro-better-ui/commit/655012f7aa03bed36948cbc957a3285f185023cc))
* the hotkey "F" on Page Watchlist will trigger focus on the filter input ([0cbd89a](https://github.com/hilezir/etoro-better-ui/commit/0cbd89a1233bc871a41f7f27f6b9c14dca1a70d9))
* the hotkey Space key to trigger "Open Trade" button ([f3302b3](https://github.com/hilezir/etoro-better-ui/commit/f3302b33de061571be358c2b7b73861985f3d4a1))



# [0.27.0-20200730](https://github.com/hilezir/etoro-better-ui/compare/v0.26.1-20200721...v0.27.0-20200730) (2020-07-30)


### Features

* a link on the sidebar can go to Pending-Orders quickly, and orders count has presented ([bc7c2de](https://github.com/hilezir/etoro-better-ui/commit/bc7c2de50db3a85d83e0dd65885b2a5f16c09d52))
* dialog add new status shown the position total amount profits ([17bdd06](https://github.com/hilezir/etoro-better-ui/commit/17bdd06fa5e9d04ff90107ead638364f0d5c534c))



## [0.26.1-20200721](https://github.com/hilezir/etoro-better-ui/compare/v0.26.0-20200721...v0.26.1-20200721) (2020-07-20)



# [0.26.0-20200721](https://github.com/hilezir/etoro-better-ui/compare/v0.25.3...v0.26.0-20200721) (2020-07-20)


### Features

* an interval value setting for inferring delay and trading system status checking ([3933da9](https://github.com/hilezir/etoro-better-ui/commit/3933da9d1eb21d798677a446937ccb4caa51836b))



## [0.25.3](https://github.com/hilezir/etoro-better-ui/compare/v0.25.2...v0.25.3) (2020-07-15)



## [0.25.2](https://github.com/hilezir/etoro-better-ui/compare/v0.25.1...v0.25.2) (2020-07-15)



## [0.25.1](https://github.com/hilezir/etoro-better-ui/compare/v0.25.0...v0.25.1) (2020-07-12)



# [0.25.0](https://github.com/hilezir/etoro-better-ui/compare/v0.24.1...v0.25.0) (2020-07-12)



## [0.24.1](https://github.com/hilezir/etoro-better-ui/compare/v0.24.0...v0.24.1) (2020-07-06)



# [0.24.0](https://github.com/hilezir/etoro-better-ui/compare/v0.23.0...v0.24.0) (2020-07-05)


### Bug Fixes

* Execution-Dialog "Manual Trading" Status ([b8425d5](https://github.com/hilezir/etoro-better-ui/commit/b8425d5e3022fefd50c6599d5bdefa46d1f43c9d))


### Features

* automatically apply last Take-Profit and Stop-Loss percent on Execution-Dialog ([67a5ad4](https://github.com/hilezir/etoro-better-ui/commit/67a5ad456959dd88122fe2a3be994defb4708008))



# [0.23.0](https://github.com/hilezir/etoro-better-ui/compare/v0.22.1...v0.23.0) (2020-07-05)


### Features

* tip for bank buy exchange rate, at sidebar withdrawal button ([6e62e02](https://github.com/hilezir/etoro-better-ui/commit/6e62e02040f8e87f073480f016d3a8d1347e1017))
* 下單視窗會在螢幕高度不夠時，自動縮小，當你的螢幕高度過小時，應該會很適合 ([f7919aa](https://github.com/hilezir/etoro-better-ui/commit/f7919aa141a5339d7c6110bc89ebbeb3bfe87804))
* 套件設定新增一個「重置設定」按鈕 ([4aaee7a](https://github.com/hilezir/etoro-better-ui/commit/4aaee7a79438542dd1600810a448a7712e5427f8))
* 關注列表上的篩選框，使 Escape 鍵也能夠清除文字 ([816cc6c](https://github.com/hilezir/etoro-better-ui/commit/816cc6c3519ad1b232f44508b03f8d53ac4e5a28))



## [0.22.1](https://github.com/hilezir/etoro-better-ui/compare/v0.22.0...v0.22.1) (2020-06-26)


### Bug Fixes

* 修復，意外使底部的額外幣種無法更新 ([e7cb89e](https://github.com/hilezir/etoro-better-ui/commit/e7cb89e0c23350a1fb070b08fd4055c7eecdc960))



# [0.22.0](https://github.com/hilezir/etoro-better-ui/compare/v0.21.0...v0.22.0) (2020-06-26)


### Bug Fixes

* 修正停用下單巨集時，介面歪掉的問題 ([2166d71](https://github.com/hilezir/etoro-better-ui/commit/2166d71e0320628e11d114b52c0a641ededecfa0))


### Features

* add option able to select USD and hidden extra currency, useful for USD native users ([4f91583](https://github.com/hilezir/etoro-better-ui/commit/4f91583b627964dd383d8b9fd92ea5cad6812cf0))



# [0.21.0](https://github.com/hilezir/etoro-better-ui/compare/v0.20.3...v0.21.0) (2020-06-26)



## [0.20.3](https://github.com/hilezir/etoro-better-ui/compare/v0.20.2...v0.20.3) (2020-06-24)


### Bug Fixes

* 修復設定窗的金額組，意外無法輸入的問題 ([780cb80](https://github.com/hilezir/etoro-better-ui/commit/780cb806bcc2a0c41d1e53de9ca26eadc6bb60e5))



## [0.20.2](https://github.com/hilezir/etoro-better-ui/compare/v0.20.1...v0.20.2) (2020-06-24)



## [0.20.1](https://github.com/hilezir/etoro-better-ui/compare/v0.20.0...v0.20.1) (2020-06-24)



# [0.20.0](https://github.com/hilezir/etoro-better-ui/compare/v0.19.0...v0.20.0) (2020-06-24)


### Features

* 「全部平倉」現在會自動打勾我要平掉所有倉位 ([77bdbdd](https://github.com/hilezir/etoro-better-ui/commit/77bdbdd0cd56490e83f4d47bc77844ce08afa52a))
* 「看更多」按鈕，現在會自動連點十次，加快你瀏覽的速度 ([61d048a](https://github.com/hilezir/etoro-better-ui/commit/61d048a1adf16b957236f86369a1f3c8e8c944be))



# [0.19.0](https://github.com/hilezir/etoro-better-ui/compare/v0.18.1...v0.19.0) (2020-06-24)


### Features

* 使 ESC 鍵按下能夠關閉下單視窗 ([4c0068c](https://github.com/hilezir/etoro-better-ui/commit/4c0068cf2ae48f9ecbff9e2d11bb2f612a050b66))
* 關注列表的文字篩選器，新增一個按鈕清除已輸入的文字 ([3df13ff](https://github.com/hilezir/etoro-better-ui/commit/3df13ff6b481fb19db5e107abcaba162f81dd8ae))



## [0.18.1](https://github.com/hilezir/etoro-better-ui/compare/v0.18.0...v0.18.1) (2020-06-22)


### Bug Fixes

* 解決意外解綁關鍵的鼠標事件，造成介面不渲染的問題 ([b0ee2ec](https://github.com/hilezir/etoro-better-ui/commit/b0ee2ec122de7bd0c8e667bad2e0c23c272e88cb))



# [0.18.0](https://github.com/hilezir/etoro-better-ui/compare/v0.17.1...v0.18.0) (2020-06-22)


### Features

* 重新設計下單視窗，提供「status.etoro.com 下單狀態」「推測延遲」「可用餘額」 ([73afc63](https://github.com/hilezir/etoro-better-ui/commit/73afc63ee76495613bddd75111bc6400cd91fcf6))



## [0.17.1](https://github.com/hilezir/etoro-better-ui/compare/v0.17.0...v0.17.1) (2020-06-21)


### Bug Fixes

* 修正 Tab 鍵切換買賣之設定介面邏輯錯誤，造成設定項不起實際作用的問題 ([d46dc4d](https://github.com/hilezir/etoro-better-ui/commit/d46dc4d7719c3ace8b92f4fccd560bead620c6d5))



# [0.17.0](https://github.com/hilezir/etoro-better-ui/compare/v0.16.0...v0.17.0) (2020-06-21)


### Bug Fixes

* 下單視窗開啟時，處理風險小提示會擋住「賣出」及「買入」的視覺問題 ([08e926c](https://github.com/hilezir/etoro-better-ui/commit/08e926ca68fa669d6a2fbd292f214350b8c9621c))


### Features

* 使用 Tab 鍵來快速切換下單視窗的「買入」及「賣出」狀態（含設定選項） ([495dd84](https://github.com/hilezir/etoro-better-ui/commit/495dd847a27f02f89f34696a5e289efe71747d0c))
* 每當展開下單視窗時，提示當前可用餘額 ([7d0c376](https://github.com/hilezir/etoro-better-ui/commit/7d0c3767c25ecfa027a39a49f11e0b2fd00c7f0a))



# [0.16.0](https://github.com/hilezir/etoro-better-ui/compare/v0.15.0...v0.16.0) (2020-06-19)


### Features

* 鎖定槓桿的功能，就算用戶點擊內建 etoro 槓桿也會有效記錄 ([2c44ccd](https://github.com/hilezir/etoro-better-ui/commit/2c44ccdb410fed5295f242236dde804ec402db19))



# [0.15.0](https://github.com/hilezir/etoro-better-ui/compare/v0.14.0...v0.15.0) (2020-06-19)


### Features

* 在投資組合中，試圖增強倉位買入賣出資訊判別 ([bc84966](https://github.com/hilezir/etoro-better-ui/commit/bc8496658640b72576e92abb565b2782a0c57799))
* 在關注列表的快篩輸入框，現在按下 enter 可快速開啟第一個標的的下單介面 ([998ed9a](https://github.com/hilezir/etoro-better-ui/commit/998ed9ae768b7b6a8ad58de1ea5d8fb65fb8c91f))
* 提供歷史記錄的篩選輸入框，以便快速查找標的 ([cee0c62](https://github.com/hilezir/etoro-better-ui/commit/cee0c6202852e29865ee8942ff141e5d0ed974e8))
* 明星投資人之投資組合，現在也能使用輸入框快速篩選 ([4ac6cd0](https://github.com/hilezir/etoro-better-ui/commit/4ac6cd09ac3956b456452d97214805e4f2f8547e))
* 關注列表可以設定只顯示「已投資的標的」但不會使輸入快篩失效 ([925e825](https://github.com/hilezir/etoro-better-ui/commit/925e82576108c3d4a7e95f1743f467fa2d653eb6))
* 鼠標移至 more button時，自動幫忙點擊以展開 more rows ([f14d805](https://github.com/hilezir/etoro-better-ui/commit/f14d805fd98fb9b072dfad353d9c738ba1da1384))



# [0.14.0](https://github.com/hilezir/etoro-better-ui/compare/v0.13.0...v0.14.0) (2020-06-18)


### Features

* 提供選項在下單輔助，使你始終能自動套用，上一次選擇的金額與槓桿 ([36c091e](https://github.com/hilezir/etoro-better-ui/commit/36c091e367d3a8d324dfae16f1ba4370bd4a5d9e)), closes [#1](https://github.com/hilezir/etoro-better-ui/issues/1)



# [0.13.0](https://github.com/hilezir/etoro-better-ui/compare/v0.12.0...v0.13.0) (2020-06-18)


### Bug Fixes

* 修復可能造成找不到元素而炸掉 ([601c964](https://github.com/hilezir/etoro-better-ui/commit/601c96418279d74f9dca0e78bee7debe85ee16a0))
* 修正 console 紅字 ([abf0650](https://github.com/hilezir/etoro-better-ui/commit/abf0650258b10f2e3aa0b0b63edb50003b06cbf3))
* 修正 i18n 造成的 toast console 紅字以及部份 typo ([84a815e](https://github.com/hilezir/etoro-better-ui/commit/84a815eefcaf8b631f8da368ed2a3482926f9da2))


### Features

* 我的投資組合頁面，提供篩選輸入框以利快速查找投資標的 ([d29f7be](https://github.com/hilezir/etoro-better-ui/commit/d29f7be0797fe20f142c1b791a2ac268a5205fbb))
* 關注列表提供緊湊模式，降低不重要得資訊，減少干擾 ([bd2755c](https://github.com/hilezir/etoro-better-ui/commit/bd2755c1d51b02c43868c6be2af64c1aa73d560e))
* 關注列表的緊湊模式，現在同樣作用在官方內建 grid-mode 之上 ([0d6fec6](https://github.com/hilezir/etoro-better-ui/commit/0d6fec6712db232f868ca446fb2c0185f917bf55))



# [0.12.0](https://github.com/hilezir/etoro-better-ui/compare/v0.11.0...v0.12.0) (2020-06-14)


### Bug Fixes

* 必須是中翻，這邊誤植了英文 ([32a9584](https://github.com/hilezir/etoro-better-ui/commit/32a9584d72f7f44adffa44ef2ab69e976f20a1df))


### Features

* 在關注清單中，簡單透過關鍵字過濾清單 ([5ce7d4b](https://github.com/hilezir/etoro-better-ui/commit/5ce7d4b1d83af6475f835f1274298a6f1578e225))



# [0.11.0](https://github.com/hilezir/etoro-better-ui/compare/v0.10.0...v0.11.0) (2020-06-11)


### Bug Fixes

* 修正以 X1 購買時，下單巨集不啟動的問題 ([63a876e](https://github.com/hilezir/etoro-better-ui/commit/63a876ef95137aee6ff518e7893816c81d57ea9a))


### Features

* 提供簡單的英文翻譯語言包 ([f4b18d9](https://github.com/hilezir/etoro-better-ui/commit/f4b18d99addf36dcdfde3c290d265f02ddb9a6cb))



# [0.10.0](https://github.com/hilezir/etoro-better-ui/compare/v0.9.1...v0.10.0) (2020-05-25)


### Features

* 提供一個設定按紐在下單輔助巨集，也能直接調整巨集金額 ([2e62c42](https://github.com/hilezir/etoro-better-ui/commit/2e62c426efbfbf8cebc2ae246d89373bcfd99bbe))



## [0.9.1](https://github.com/hilezir/etoro-better-ui/compare/v0.9.0...v0.9.1) (2020-05-20)


### Bug Fixes

* 修正下單輔助巨集，掛單時，意外同時設置掛單價格，以及止損的問題 ([6bc63e0](https://github.com/hilezir/etoro-better-ui/commit/6bc63e00916be95d7c592e910afa36ed05700cff))



# [0.9.0](https://github.com/hilezir/etoro-better-ui/compare/v0.8.1...v0.9.0) (2020-05-17)


### Features

* 關注列表之投資人，快捷鍵使你更快的到達投資組合頁面 ([821afc8](https://github.com/hilezir/etoro-better-ui/commit/821afc8b8933508d6dd6540f8c0bd3a4f1fab9e1))



## [0.8.1](https://github.com/hilezir/etoro-better-ui/compare/v0.8.0...v0.8.1) (2020-05-15)


### Bug Fixes

* 修正在「我的投資」不會正確顯示下單輔助巨集的問題 ([382c873](https://github.com/hilezir/etoro-better-ui/commit/382c873b3cd67d73fca2463c158eaa546f579613))



# [0.8.0](https://github.com/hilezir/etoro-better-ui/compare/v0.7.3...v0.8.0) (2020-05-13)


### Features

* 在左側欄提供簡易的延遲監控 ([9b92800](https://github.com/hilezir/etoro-better-ui/commit/9b92800649933727c140e30341be78746e85d092))
* 提供輔助巨集的自訂金額設定 ([9c3cde6](https://github.com/hilezir/etoro-better-ui/commit/9c3cde6146e11fe088f440a9b46f5ace2d074f00))



## [0.7.3](https://github.com/hilezir/etoro-better-ui/compare/v0.7.2...v0.7.3) (2020-05-05)


### Bug Fixes

* 修復問題 etoro 近期內改版，它將左側欄加入了隨機的 HTML 屬性，造成樣式呈現失效 ([79e6647](https://github.com/hilezir/etoro-better-ui/commit/79e6647c2d47350ee8d36f2ba48039f962171630))



## [0.7.2](https://github.com/hilezir/etoro-better-ui/compare/v0.7.1...v0.7.2) (2020-04-28)


### Bug Fixes

* 嘗試修復某些狀況（疑歐洲監管）不會出現巨集輔助介面的情況 ([aac4b18](https://github.com/hilezir/etoro-better-ui/commit/aac4b1843fb0b00a961a7e7bcd03ed58db50aa24)), closes [#1](https://github.com/hilezir/etoro-better-ui/issues/1)



## [0.7.1](https://github.com/hilezir/etoro-better-ui/compare/v0.7.0...v0.7.1) (2020-04-19)


### Bug Fixes

* 修復左側欄巨集啟用狀態不正確顯示的問題（該問題不影響功能） ([b113460](https://github.com/hilezir/etoro-better-ui/commit/b11346040784aa2b86bb2486889f4e75a921a434))



# [0.7.0](https://github.com/hilezir/etoro-better-ui/compare/v0.6.0...v0.7.0) (2020-04-19)


### Features

* 左側欄加入風險說明書連結 ([5558c4f](https://github.com/hilezir/etoro-better-ui/commit/5558c4f51320f8494305390777d51e66f53505f1))
* 新增功能「下單輔助巨集」預設停用，使用前請詳閱風險說明書 ([33a9e3a](https://github.com/hilezir/etoro-better-ui/commit/33a9e3afc4adfc00a71029f4c9dd6ae84b3d337c))
* 變更設定，現在在介面顯示進度君 ([a4bed53](https://github.com/hilezir/etoro-better-ui/commit/a4bed53805715c1d250519633a1ec4f9ddbe8fda))
* 部署 React.js，並展示歡迎訊息 ([9edae68](https://github.com/hilezir/etoro-better-ui/commit/9edae68995a97594ff66283d9c49beaa3bcd6219))



# [0.6.0](https://github.com/hilezir/etoro-better-ui/compare/v0.5.0...v0.6.0) (2020-04-17)


### Features

* 在左側欄顯示當前選定幣別 ([8dfe7ea](https://github.com/hilezir/etoro-better-ui/commit/8dfe7ea3c156114147e44d750a7c3c1900a3b444))
* 貨幣千分位；以及馬幣小數點 ([3c509b1](https://github.com/hilezir/etoro-better-ui/commit/3c509b1b705d508aa9a015fde7251a055baaeefa))



# [0.5.0](https://github.com/hilezir/etoro-better-ui/compare/v0.3.0...v0.5.0) (2020-04-15)


### Bug Fixes

* 修復了某些被關注者無法取得餘額 ([9eb3ba8](https://github.com/hilezir/etoro-better-ui/commit/9eb3ba89353481ef0717966a7816165ac79c7c83))


### Features

* 使「買入與賣出按鈕」更加立體明確 ([e5e490b](https://github.com/hilezir/etoro-better-ui/commit/e5e490b12b415276c7d61e7f1ad1617f2ccfa9a3))
* 使餘額按鈕盡可能地可以顯示在更窄寬度的畫面中 ([2e0f5ae](https://github.com/hilezir/etoro-better-ui/commit/2e0f5aefd429cbbeffea045dc50382ec25b22a9d))
* 可檢查被你關注的人的餘額，他們進場了嗎？ ([a9c5036](https://github.com/hilezir/etoro-better-ui/commit/a9c5036d7039aace675db2d360b120fcfa409074))
* 在側邊欄加入官網與聯絡作者連結 ([c289548](https://github.com/hilezir/etoro-better-ui/commit/c289548af18632ac2645857a931b7c1880afc080))
* 左側欄提供更多腳本相關資訊，與提供匯兌選擇器 ([2de27f3](https://github.com/hilezir/etoro-better-ui/commit/2de27f347ad86c17dca4d1420158a35422e7a154))



# 0.3.0 (2020-04-13)



