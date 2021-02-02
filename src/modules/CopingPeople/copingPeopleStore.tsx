/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import React from 'react'
import cogoToast from 'cogo-toast'
import { angularAPI } from '~/angularAPI'
import { AppTrans } from '~/components/AppTrans'
import { etoroAPI } from '~/etoroAPI'
import { createStore } from '~/store/createStore'

export const copingPeopleStore = createStore<{
  readonly open: boolean
  showHistory(): Promise<void>
  data: HistoryPosition[]
  get(username: string): Group | undefined
}>((set, get) => {
  return {
    open: false,
    data: [],
    async showHistory() {
      const loading = cogoToast.loading(<AppTrans i18nKey={'loading'} />)

      const username =
        globalThis.location.href.match(
          /portfolio[/](?<username>[\w\d\-_]+)[/]?/i,
        )?.groups?.username || ''

      const user = this.get(username)

      if (user?.CID) {
        const data = await etoroAPI.getHistoryByMirrorID(user.MirrorID)

        set(state => {
          state.data = data
          state.open = true
        })
      } else {
        set(state => {
          state.data = []
        })
      }

      loading.hide?.()
    },
    get(username) {
      const groups = angularAPI.$rootScope?.session.user.portfolio.groups || []

      return groups.find(
        item => item.GroupName.toLowerCase() === username.toLowerCase(),
      )
    },
  }
})
