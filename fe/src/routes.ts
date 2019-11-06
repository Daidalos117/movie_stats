const baseApiUrl = process.env.REACT_APP_BE_URL || 'https://localhost:8080/api/';
const baseFeUrl = process.env.REACT_APP_FE_URL || 'https://localhost:3000';

const API = {
  auth: {
    login: 'auth/',
  },
  movie: {

  },
  history: {
    index: 'history'
  }
}

const FE = {
  index: "/",
  home: "/home",
  movie: {
    detail: "movie/detail/",
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
