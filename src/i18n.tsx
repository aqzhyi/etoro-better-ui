import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhJSON from '../locales/zh.json'
import enJSON from '../locales/en.json'
import { angularAPI } from '~/angularAPI'

i18next.use(initReactI18next).init({
  resources: {
    zh: { translation: zhJSON },
    en: { translation: enJSON },
  },
  fallbackLng:
    (angularAPI.$rootScope?.session.locale.includes('zh') && 'zh') || 'en',
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})
