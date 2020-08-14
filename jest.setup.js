/* eslint-disable no-undef */
jest.setTimeout(10000) // in milliseconds

jest.mock('@/GM', () => ({
  GM: {
    ajax: jest.fn(),
    addStyle: jest.fn(),
  },
}))
