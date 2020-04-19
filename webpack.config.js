const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const globby = require('globby')
const webpackNodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BannerPlugin } = require('webpack')

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
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
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
        enforce: 'pre',
        exclude: [/node_modules/],
        loader: 'eslint-loader',
        test: /\.tsx?$/,
      },
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
    new CleanWebpackPlugin(),
    new Dotenv({
      defaults: false,
      systemvars: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      checkSyntacticErrors: true,
      eslint: true,
      formatter: 'codeframe',
      ignoreLintWarnings: true,
      memoryLimit: 4096,
      reportFiles: ['src/**/*.{ts,tsx}'],
      silent: false,
    }),
    new BannerPlugin({
      test: /etoro/,
      raw: false,
      banner: `
        /** 更新日誌： https://github.com/hilezir/etoro-better-ui/releases */

        // ==UserScript==
        // @name          Better etoro UI for Taiwan
        // @description   提供你更好的 etoro 新台幣介面增強懶人包
        // @version       0.7.2
        // @author        hilezir
        // @grant         GM_xmlhttpRequest
        // @grant         GM_addStyle
        // @match         https://*.etoro.com/*
        // @match         https://etoro.com/*
        // @run-at        document-idle
        // @noframes
        // @namespace     http://tampermonkey.net/

        ///////////////////** 開源程式碼庫 */
        // @connect       cdn.jsdelivr.net
        // @connect       cdnjs.cloudflare.com

        ///////////////////** 台灣臺灣銀行 */
        // @connect       bot.com.tw

        ///////////////////** 馬國大眾銀行 */
        // @connect       www.pbebank.com

        ///////////////////** 本地開發專用 */
        // !@connect       127.0.0.1
        // ==/UserScript==

        window.GM_xmlhttpRequest({
          // url: 'http://127.0.0.1:8080/etoro.bundle.js', // 開發模式
          url: 'https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@v0.7.2/src_dist/etoro.bundle.js',
          onload: event => {
            eval(event.responseText)
          },
        })
      `,
    }),
  ],
}

module.exports = configration
