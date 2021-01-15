/** @jsx jsx */ import { css, jsx } from '@emotion/react'
import { memo } from 'react'
import { AppTrans } from '~/components/AppTrans'

export const BuyText = memo<ReactProps>(function BuyText(props) {
  return (
    <span
      css={css`
        color: #51c91e;

        :after {
          display: inline-block;
          content: '📈 ';
        }
      `}
    >
      <AppTrans i18nKey='tradeDashboard_itBuy'></AppTrans>
    </span>
  )
})
