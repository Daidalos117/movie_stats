import { observable, action, runInAction } from 'mobx';
import { baseApiUrl } from 'routes';
import { AxiosError } from 'axios';
import api from '../api/backend';

export class ApiStore<T> {
  localStorageKey: string = 'oath_token';

  endpoint: string = baseApiUrl;

  @observable data: T | null = null;

  @observable error: null | AxiosError = null;

  @observable _token: string | null  = localStorage.getItem(this.localStorageKey);


  set token(token) {
    if(token) {
      localStorage.setItem(this.localStorageKey, token);
    }
    this._token = token;
  }

  get token() {
    localStorage.getItem(this.localStorageKey);
    return this._token;
  }

  @action
  async fetchData<T>(endpoint: string) {
    try {
      const resp = await api.get<T>(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
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
