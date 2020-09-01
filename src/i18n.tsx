import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhJSON from '../locales/zh.json'
import enJSON from '../locales/en.json'
import { angularAPI } from '~/angularAPI'
import { emitter, Events } from '~/emitter'

emitter.once(Events.ready).then(function initI18next() {
  i18next.use(initReactI18next).init({
    resources: {
      zh: { translation: zhJSON },
      en: { translation: enJSON },
    },
    fallbackLng:
      (angularAPI.$rootScope?.session.locale.includes('zh') && 'zh') || 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })
})
