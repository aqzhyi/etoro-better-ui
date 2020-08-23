import { useTranslation } from 'react-i18next'
import zhLocale from '../../locales/zh.json'
import { ExistsFunction } from 'i18next'

export const usePrimaryTranslation = () =>
  (useTranslation() as unknown) as Omit<
    ReturnType<typeof useTranslation>,
    'T'
  > & {
    t: ExistsFunction<keyof typeof zhLocale>
  }
