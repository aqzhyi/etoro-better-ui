/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import React from 'react'
import cogoToast from 'cogo-toast'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { etoroAPI } from '~/etoroAPI'
import { createStore } from '~/store/createStore'
import { find, keys } from 'lodash'

export const copingPeopleStore = createStore<{
  readonly open: boolean
  showHistory(username: string, options?: { public?: boolean }): Promise<void>
  data: HistoryPosition[]
  get(username: string): Group | undefined
}>((set, get) => {
  return {
    open: false,
    data: [],
    async showHistory(username, options) {
      const loading = cogoToast.loading(<AppTrans i18nKey={'loading'} />)

      const user = this.get(username)
      const userCID =
        angularAPI.$rootScope?.session.user.usersFactory?.usernamesMapping[
          keys(
            angularAPI.$rootScope?.session.user.usersFactory
              ?.usernamesMapping || {},
          ).find(name => name.toLowerCase() === username.toLowerCase()) || 0
        ]

      if (userCID || user?.CID) {
        const data =
          !options?.public && user
            ? await etoroAPI.getHistoryByMirrorID(user.MirrorID)
            : await etoroAPI.getHistoryOfPublicByCID(Number(userCID))

        set(state => {
          state.data = data
        })
      } else {
        set(state => {
          state.data = []
        })
      }

      loading.hide?.()

      if (get().data.length) {
        return
      }

      throw new Error(`No Data By Searching username: ${username}`)
    },
    get(username) {
      const groups = angularAPI.$rootScope?.session.user.portfolio.groups || []

      return groups.find(
        item => item.GroupName.toLowerCase() === username.toLowerCase(),
      )
    },
  }
})
