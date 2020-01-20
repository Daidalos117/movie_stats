import { baseApiUrl } from 'routes';
import axios from 'axios';

const instance = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000
});

export const fetcher = (url: string, config = {}) => {
  return instance(url, { ...config })
    .then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response.data;
    })
    .catch(e => {
      console.error('Fetch error', e);
    });
};

instance.defaults.timeout = 10000;

export default instance;
