import axios from 'axios';
import { tmdb } from 'routes';

const instance = axios.create({
  baseURL: tmdb.baseUrl,
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

instance.defaults.timeout = 10000;

export const fetcher = (url: string, config = {}) =>
  instance(url, { ...config }).then(response => {
    return response.data;
  });

export default instance;
