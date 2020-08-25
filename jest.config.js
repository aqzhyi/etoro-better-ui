const path = require('path')
const { jestPreset } = require('ts-jest')

module.exports = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  transform: {
    /** 👇 { '^.+\\.tsx?$': 'ts-jest' } */
    ...jestPreset.transform,
    /** 👇 make babel-plugins works on jest */
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '~\\/(.*)': path.resolve(__dirname, 'src/$1'),
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    // '@testing-library/react/cleanup-after-each',
    // '@testing-library/jest-dom',
    // '@testing-library/jest-dom/extend-expect',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
}
