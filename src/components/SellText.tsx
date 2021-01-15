/** @jsx jsx */ import { css, jsx } from '@emotion/react'
import { memo } from 'react'
import { AppTrans } from '~/components/AppTrans'

export const SellText = memo<ReactProps>(function SellText(props) {
  return (
    <span
      css={css`
        color: #ae1f1f;

        :after {
          display: inline-block;
          content: '📉 ';
        }
      `}
    >
      <AppTrans i18nKey='tradeDashboard_itSell'></AppTrans>
    </span>
  )
})
