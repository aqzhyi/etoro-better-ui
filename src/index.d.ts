declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'test' | 'production' | 'development'
  }
}
