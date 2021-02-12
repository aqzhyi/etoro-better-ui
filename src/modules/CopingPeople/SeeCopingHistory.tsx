/** @jsx jsx */ import { jsx, css } from '@emotion/react'
import { Dialog } from '@material-ui/core'
import dayjs from 'dayjs'
import React, { Fragment } from 'react'
import { memo } from 'react'
import { AppTrans } from '~/components/AppTrans'
import { BuyText } from '~/components/BuyText'
import { InstrumentIcon } from '~/components/InstrumentIcon'
import { ProfitText } from '~/components/ProfitText'
import { SellText } from '~/components/SellText'
import { copingPeopleStore } from '~/modules/CopingPeople/copingPeopleStore'

export const SeeCopingHistory = memo<ReactProps>(function SeeCopingHistory(
  props,
) {
  const hidden = copingPeopleStore(state => !state.open)
  const data = copingPeopleStore(state => state.data)

  return (
    <Dialog
      maxWidth='lg'
      onClose={() => {
        copingPeopleStore.setState({ open: false })
      }}
      hidden={hidden}
      open
    >
      {data.map((item, index) => (
        <div
          key={item.PositionID}
          css={css`
            display: flex;
            align-items: center;

            & > span {
              margin: 16px 32px;
            }
          `}
        >
          <span>#{index + 1}</span>
          <span>{item.IsBuy ? <BuyText /> : <SellText />}</span>
          <span>
            <InstrumentIcon id={item.InstrumentID} />
          </span>
          <span>
            ${item.Amount} x {item.Leverage}
          </span>
          <span>
            {item.MirrorID === 0 ? (
              <ProfitText profit={item.NetProfit} noDollarSign suffix={'%'} />
            ) : (
              <ProfitText profit={item.NetProfit} />
            )}
          </span>
          <span>{dayjs(item.OpenDateTime).format('YYYY/MM/DD hh:mm:ss')}</span>
          <span> ~ </span>
          <span>{dayjs(item.CloseDateTime).format('YYYY/MM/DD hh:mm:ss')}</span>
          <span>
            <AppTrans i18nKey='openRate' />＠ {item.OpenRate}
          </span>
          <span>
            <AppTrans i18nKey='closeRate' />＠ {item.CloseRate}
          </span>
        </div>
      ))}
    </Dialog>
  )
})
