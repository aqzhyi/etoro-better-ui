import dayjs from 'dayjs'
import ky from 'ky'
import urlcat from 'urlcat'
import { angularAPI } from '~/angularAPI'

export const etoroAPI = {
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
