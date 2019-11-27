import { observable, action, runInAction, observe } from 'mobx';
import { baseApiUrl } from 'routes';
import { AxiosError } from 'axios';
import api from '../axios/backend';

export class ApiStore<T> {
  localStorageKey: string = 'oath_token';

  endpoint: string = baseApiUrl;

  @observable data: T | null = null;

  @observable error: null | AxiosError = null;

  @observable _token: string | null = null;

  constructor() {
    observe(this, change => {
      if (change.name === '_token' && change.type === 'update') {
        // set api token auth
        api.defaults.headers['Authorization'] = `Bearer ${change.newValue}`;
      }
    });

    const localToken = localStorage.getItem(this.localStorageKey);
    if (localToken) {
      this._token = localToken;
    }
  }

  set token(token) {
    if (token) {
      localStorage.setItem(this.localStorageKey, token);
    }

    this._token = token;
  }

  get token() {
    localStorage.getItem(this.localStorageKey);
    return this._token;
  }

  @action
  async fetchData<T>(endpoint: string, params: any = {}) {
    try {
      const resp = await api.get<T>(endpoint, {
        params
      });

      return runInAction(() => {
        return resp;
      });
    } catch (error) {
      return runInAction(() => {
        this.error = error;
        return false;
      });
    }
  }
}
