import { Kbd } from '~/components/Kbd'
import React, { memo } from 'react'
import { Trans, TransProps } from 'react-i18next'
import type * as zhLocale from '../../locales/zh.json'
import { NotableText } from '~/components/NotableText'

const RiskLink: React.FC = props => (
  <a
    target='_blank'
    href='https://www.notion.so/hilezi/eToro-better-UI-helper-enhancement-chrome-extension-plugin-4fe69cd704434ff1b82f0cd48dd219c3#3cca48e4edb24d089241bd1c851fa1ae'
  >
    {props.children}
  </a>
)

export const AppTrans: React.FC<
  Omit<TransProps<any>, 'i18nKey'> & {
    i18nKey: keyof typeof zhLocale
  }
> = memo(function AppTrans(props) {
  return (
    <Trans
      {...props}
      components={{
        notable: <NotableText></NotableText>,
        kbd: <Kbd></Kbd>,
        riskLink: <RiskLink></RiskLink>,
      }}
    >
      {props.children}
    </Trans>
  )
})
