import cogoToast from 'cogo-toast'
import React from 'react'
import { debugAPI } from '@/debugAPI'
import { PrimaryTrans } from '@/components/PrimaryTrans'

/** 計算啟動時間 */
const bootstrapStartAt = new Date()

export const showWelcomeMessage = () => {
  const { hide } = cogoToast.success(
    <PrimaryTrans i18nKey='universal_welcomeMessage_text'></PrimaryTrans>,
    {
      position: 'bottom-left',
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
