import dayjs from 'dayjs'
import ky from 'ky'
import urlcat from 'urlcat'
import { angularAPI } from '~/angularAPI'

export const etoroAPI = {
  async getHistoryByMirrorID(MirrorID: number) {
    const status = {
      ...angularAPI.$rootScope?.session.config.statics,
      accounttype: angularAPI.$rootScope?.session.accountMode,
    }

    return ky
      .get(
        urlcat(
          `https://www.etoro.com/sapi/trade-data-real/history/private/mirrors/5668789`,
          {
            ItemsPerPage: 500,
            MirrorID: MirrorID,
            PageNumber: 1,
          },
        ),
        {
          headers: {
            accounttype: status.accounttype || '',
            applicationidentifier: status.ApplicationIdentifier || '',
            applicationversion: status.ApplicationVersion || '',
            authorization:
              angularAPI.$rootScope?.session.stsData?.accessToken || '',
          },
        },
      )
      .json<{
        HistoryPositions: HistoryPosition[]
        MirrorOperations: any[]
      }>()
      .then(data => data.HistoryPositions)
  },
  async getHistory() {
    const status = {
      ...angularAPI.$rootScope?.session.config.statics,
      accounttype: angularAPI.$rootScope?.session.accountMode,
    }

    return ky
      .get(
        urlcat(
          ` https://www.etoro.com/sapi/trade-data-real/history/private/credit/flat`,
          {
            ItemsPerPage: 30,
            PageNumber: 1,
            StartTime: dayjs().subtract(1, 'day').toISOString(),
          },
        ),
        {
          headers: {
            accounttype: status.accounttype || '',
            applicationidentifier: status.ApplicationIdentifier || '',
            applicationversion: status.ApplicationVersion || '',
            authorization:
              angularAPI.$rootScope?.session.stsData?.accessToken || '',
          },
        },
      )
      .json<{
        HistoryPositions: HistoryPosition[]
        Cashflows: any[]
      }>()
      .then(data => data.HistoryPositions)
  },
}
