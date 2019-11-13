import { baseApiUrl } from 'routes';
import axios from 'axios';
import api from './backend';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

instance.defaults.timeout = 10000;

export const fetcher = (url: string, config = {}) => {
  return instance(url, { ...config }).then(response => {
    // returning the data here allows the caller to get it through another .then(...)
    return response.data;
  });
};

export default instance;
