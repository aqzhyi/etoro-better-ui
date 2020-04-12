const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const globby = require('globby')
const webpackNodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BannerPlugin } = require('webpack')

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
    mainFields: ['main'],
    extensions: ['.js', '.tsx', '.ts'],
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
      raw: true,
      banner: `
        // ==UserScript==
        // @name         Better etoro UI for Taiwan
        // @description  提供你更好的 etoro 新台幣介面增強懶人包
        // @version      0.2
        // @author       hilezir
        // @match        https://*.etoro.com/*
        // @match        https://etoro.com/*
        // @grant        GM_xmlhttpRequest
        // @grant        GM_addStyle
        // @namespace    http://tampermonkey.net/
        /** ℹ️ @require     https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@master/src_dist/etoro.bundle.js */
        // ==/UserScript==
      `,
    }),
  ],
}

module.exports = configration
