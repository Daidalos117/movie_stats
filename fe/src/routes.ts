const baseApiUrl = process.env.REACT_APP_BE_URL || 'https://localhost:8080/api/';
const baseFeUrl = process.env.REACT_APP_FE_URL || 'https://localhost:3000';

const API = {
  auth: {
    login: 'auth',
  },
  movie: {
    index: 'movie',
  },
  history: {
    index: 'history',
    sync: 'sync'
  }
}

const FE = {
  index: "/",
  home: "/home",
  movie: {
    index: 'movie',
    detail: "detail",
  },
  auth: {
    callback: '/loginCallback'
  }
}

const traktLogin = baseApiUrl + API.auth.login;

export {
  baseApiUrl,
  API,
  traktLogin,
  FE
}
