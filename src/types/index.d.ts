const { registeredComponents } = await import('~/utils/registerReactComponent')
const { store } = await import('~/store/_store')

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'test' | 'production' | 'development'
  }
}

declare namespace globalThis {
  const unsafeWindow: Window & {
    __BETTER_ETORO_UI__: {
      registeredComponents: typeof registeredComponents
      store: typeof store
    }
  }
}

interface NodeModule {
  hot?: {
    accept?(dep, callback)
  }
}

declare module '*.svg' {
  const component: React.FC
  export default component
}

declare interface Number extends Number {
  toNumberFixed(value: number): number
}
