const baseApiUrl = process.env.REACT_APP_BE_URL || 'https://localhost:8080/api';
const baseFeUrl = process.env.REACT_APP_FE_URL || 'https://localhost:3000';



const sync = {
  sync: 'sync',
  syncItemsCount: 'syncItemsCount',
  pagedSync: 'pagedSync',
}

const API = {
  auth: {
    login: 'auth'
  },
  movie: {
    index: 'movie',
    ...sync
  },
  show: {
    index: 'show',
    ...sync
  },
  history: {
    index: 'history',

  }
};

const FE = {
  index: '/',
  home: 'home',
  movie: {
    index: 'movie',
    detail: 'detail'
  },
  show: {
    index: 'show',
    detail: 'detail',
  },
  auth: {
    callback: '/loginCallback'
  }
};

const traktLogin = baseApiUrl + API.auth.login;

const tmdb = {
  baseUrl: 'https://api.themoviedb.org/3',
  image: {
    /* https://www.themoviedb.org/talk/5aeaaf56c3a3682ddf0010de */
    base: 'https://image.tmdb.org/t/p/original',
    w780: 'https://image.tmdb.org/t/p/w780',
    w185: 'https://image.tmdb.org/t/p/w185',
    w300: 'https://image.tmdb.org/t/p/w300'
  }
};

export { baseApiUrl, baseFeUrl, API, traktLogin, FE, tmdb };
