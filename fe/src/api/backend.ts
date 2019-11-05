import {baseApiUrl} from 'routes';
import axios from 'axios';


const instance = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000,
});

instance.defaults.timeout = 10000;

export default instance;
