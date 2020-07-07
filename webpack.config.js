const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const globby = require('globby')
const webpackNodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BannerPlugin } = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const packageJSON = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'

const srcSubAlias = globby
  .sync(['src/*'], {
    expandDirectories: false,
    onlyDirectories: true,
  })
  .reduce((alias, item) => {
    const [, directory] = item.split('/')
    alias[`@/${directory}`] = path.join(__dirname, item)
    return alias
  }, {})

const srcRootFilesAlias = globby
  .sync(['src/*'], {
    onlyFiles: true,
  })
  .reduce((alias, item) => {
    const [, filename] = item.split('/')
    alias[`@/${filename.replace(/\.tsx?$/, '')}`] = path.join(__dirname, item)
    return alias
  }, {})

/** @ts-check */
const configration = {
  externals: [],
  stats: {
    warnings: false,
  },
  /** TODO: cheap-module-eval-source-map is no suit for production */
  devtool: isProd ? '' : 'cheap-module-eval-source-map',
  mode: isProd ? 'production' : 'development',
  entry: {
    etoro: path.resolve(__dirname, 'src/etoro'),
  },
  output: {
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'src_dist'),
  },
  resolve: {
    /**
     * going
     *   @/actions: __dirname + src/actions
     *   @/lib: __dirname + src/lib
     *   ....
     * and so on
     */
    alias: {
      ...srcSubAlias,
      ...srcRootFilesAlias,
    },
    mainFields: ['main'],
    extensions: ['.js', '.tsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new Dotenv({
      defaults: false,
      systemvars: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: ['src/**/*.{ts,tsx}'],
      },
      formatter: { type: 'codeframe', options: { highlightCode: true } },
      issue: {
        // Do NOT show warnings in console, but expected it's shown on VSCode
        exclude: issues => {
          return issues.severity === 'warning'
        },
      },
    }),
    new ProgressBarPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new BannerPlugin({
      test: /etoro/,
      raw: false,
      banner: `
        /** 更新日誌： https://github.com/hilezir/etoro-better-ui/releases */

        // ==UserScript==
        // @name            eToro Better UI
        // @name:en         eToro Better UI
        // @description     本套件不提供「自動程式交易」的功能，本套件的核心思想是在盡可能不破壞 eToro 的介面上，介入提升用戶體驗。因此你仍然應該由自己作主下單交易。100% 開源程式碼，免費安裝並使用。
        // @description:en  An extension in order to improve Better UI/UX on the eToro system. 100% Open Source on Github can be inspected or verify, no worries.
        // @version         ${packageJSON.version}
        // @author          hilezir
        // @grant           GM_xmlhttpRequest
        // @grant           GM_addStyle
        // @match           https://*.etoro.com/*
        // @match           https://etoro.com/*
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

        window.GM_xmlhttpRequest({
          // url: 'http://127.0.0.1:8087/etoro.bundle.js', // 開發模式
          url: 'https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@v${packageJSON.version}/src_dist/etoro.bundle.js',
          onload: event => {
            eval(event.responseText)
          },
        })
      `,
    }),
  ].filter(Boolean),
}

module.exports = configration
