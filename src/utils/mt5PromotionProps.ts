import { AnchorHTMLAttributes } from 'react'
import { gaAPI, GaEventId } from '~/gaAPI'

export const mt4PromotionProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
  href: 'https://trk.pepperstonepartners.com/aff_c?offer_id=367&aff_id=28051',
  target: '_self',
  onClick: () => {
    globalThis.window.open(
      'https://www.notion.so/hilezi/Trading-SPX500-NASDAQ-GER30-GOLD-ETF-stocks-CFD-with-lower-spread-and-Auto-Trading-Assistant-cd480d0b631d4a4ea8ea2b84d099edbf',
      '_blank',
    )
    gaAPI.sendEvent(GaEventId.sidebar_mt5PromotionLinkClick)
  },
}
