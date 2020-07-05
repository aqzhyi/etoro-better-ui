import { createAsyncThunk } from '@reduxjs/toolkit'

type StatusEnum = 'Degraded Performance' | 'Operational' | 'Partial Outage'

export type StatusInfoAggregate = {
  API: { status: StatusEnum }
  Affiliates: { status: StatusEnum }
  Apps: { status: StatusEnum }
  'Automatic Execution': { status: StatusEnum }
  Charts: { status: StatusEnum }
  'Copy Trading': { status: StatusEnum }
  'Credit Cards': { status: StatusEnum }
  Deposit: { status: StatusEnum }
  Discovery: { status: StatusEnum }
  History: { status: StatusEnum }
  KYC: { status: StatusEnum }
  Login: { status: StatusEnum }
  'Manual trading - Real': { status: StatusEnum }
  'Manual trading - Virtual': { status: StatusEnum }
  More: { status: StatusEnum }
  'News Feed': { status: StatusEnum }
  Notifications: { status: StatusEnum }
  PayPal: { status: StatusEnum }
  Payments: { status: StatusEnum }
  Portfolio: { status: StatusEnum }
  Registeration: { status: StatusEnum }
  'Sign up page': { status: StatusEnum }
  Stats: { status: StatusEnum }
  'Trade markets': { status: StatusEnum }
  Trading: { status: StatusEnum }
  Wallet: { status: StatusEnum }
  Watchlist: { status: StatusEnum }
  Website: { status: StatusEnum }
  'Wire Transfer': { status: StatusEnum }
  Withdrawals: { status: StatusEnum }
  'eToro Connect': { status: StatusEnum }
}

export const fetchStatusInfoAggregate = createAsyncThunk<
  Partial<StatusInfoAggregate>
>('setStatusInfoAggregate', async function (props, thunkAPI) {
  const statusInfoAggregate = await globalThis
    .fetch('https://status.etoro.com/')
    .then(res => res.text())
    .then(res => {
      const html = $(res)

      const statusInfoAggregate = {}

      html.find('.component-container .name').each((index, element) => {
        const key = $(element).text().trim()
        const status = $(element)
          .parent()
          .find('.component-status')
          .text()
          .trim()

        statusInfoAggregate[key] = {
          status,
        }
      })

      return statusInfoAggregate as StatusInfoAggregate
    })

  return statusInfoAggregate
})
