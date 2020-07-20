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
    new BundleAnalyzerPlugin({ analyzerPort: 8897 }),
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
        github: https://github.com/hilezir/etoro-better-ui

        version: ${packageJSON.version}

        website: https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3
      `,
    }),
  ].filter(Boolean),
}

module.exports = configration
