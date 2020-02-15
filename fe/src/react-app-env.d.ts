declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string,
    REACT_APP_TMDB_API_KEY: string,
    REACT_APP_TMDB_TOKEN: string,
    REACT_APP_ITEMS_PER_PAGE_SYNC: number;
  }
}
