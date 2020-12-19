module.exports = {
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
    'lodash',
  ],
}
