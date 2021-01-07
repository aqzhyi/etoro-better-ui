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

/**
 * 「React.PropsWithChildren」 的別名
 *
 * 並且同時具有將 emotion 的 css prop 轉換為 props.className?: string 的型別
 *
 * @example <caption>最簡使用</caption>
 *   export const MyComponent = memo(function MyComponent(props: ReactProps) {
 *     return <div className={props.className}>{props.childred}</div>
 *   })
 *
 * @example <caption>加入其它客製 props</caption>
 *   type MyProps = { foo: boolean }
 *
 *   export const MyComponent: ReactProps<MyProps> = memo(function MyComponent(
 *     props,
 *   ) {
 *     console.info(props.foo)
 *
 *     return <div data-foo={props.foo}>{props.childred}</div>
 *   })
 */
declare type ReactProps<
  P extends Record<string | symbol, unknown> = import('tsdef').AnyObject
> = React.PropsWithChildren<P>
