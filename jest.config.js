const path = require('path')
const { jestPreset } = require('ts-jest')

module.exports = {
  testEnvironment: 'node',
  transform: {
    /** 👇 { '^.+\\.tsx?$': 'ts-jest' } */
    ...jestPreset.transform,
    /** 👇 make babel-plugins works on jest */
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '@\\/(.*)': path.resolve(__dirname, 'src/$1'),
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.[tj]s?(x)',
    '<rootDir>/**/*.{spec,test}.[tj]s?(x)',
  ],
}
