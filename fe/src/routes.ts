const baseApiUrl = process.env.REACT_APP_BE_URL || 'https://localhost:8080/api';
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
  home: "home",
  movie: {
    index: 'movie',
    detail: "detail",
  },
  auth: {
    callback: '/loginCallback'
  }
}

const traktLogin = baseApiUrl + API.auth.login;


const tmdb = {
  baseUrl: "https://api.themoviedb.org/3",
  image: {
    base: 'https://image.tmdb.org/t/p/original',
    w780: 'https://image.tmdb.org/t/p/w780',
    w185: 'https://image.tmdb.org/t/p/w185',
  }
}


export {
  baseApiUrl,
  baseFeUrl,
  API,
  traktLogin,
  FE,
  tmdb
}
