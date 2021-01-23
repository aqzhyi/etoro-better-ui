// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// @ts-check
/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    'etoro-better-ui.latest': './src/etoro',
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-react'],
                ['@babel/preset-typescript'],
                ['@babel/preset-env'],
                ['@emotion/babel-preset-css-prop'],
              ],
              plugins: [
                [
                  'babel-plugin-import',
                  {
                    libraryName: 'react-use',
                    libraryDirectory: 'lib',
                    camel2DashComponentName: false,
                  },
                  'react-use',
                ],
                [
                  'babel-plugin-import',
                  {
                    libraryName: 'libreact',
                    libraryDirectory: 'lib',
                    camel2DashComponentName: false,
                  },
                  'libreact',
                ],
                ['lodash'],
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },
}

module.exports = config
