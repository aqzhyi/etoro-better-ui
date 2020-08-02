import cogoToast from 'cogo-toast'
import { i18n } from '@/i18n'
import React from 'react'
import { debugAPI } from '@/debugAPI'

/** 計算啟動時間 */
const bootstrapStartAt = new Date()

export const showWelcomeMessage = () => {
  const { hide } = cogoToast.success(
    i18n.universal_welcomeMessage_text(() => (
      <a
        style={{
          color: 'blue',
        }}
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
        target='_blank'
      >
        better-etoro-ui
      </a>
    )),
    {
      position: 'top-left',
      hideAfter: 8,
      onClick: () => {
        hide?.()
      },
    },
  )

  const bootstrapEndedAt = new Date()
  const bootstrapUsedTime =
    bootstrapEndedAt.getTime() - bootstrapStartAt.getTime()

  debugAPI.universal(`起動時間 = ${bootstrapUsedTime}ms`)
}
