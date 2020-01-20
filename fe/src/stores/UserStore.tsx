// src/stores/theme-store.tsx
import { observable, action, runInAction } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';

interface User {
  username: string;
  token: string;
  trakt: {
    id: string;
    status: boolean;
    access_token: string;
    vip: boolean;
  };
}

class UserStore extends ApiStore {
  endpoint = 'user';

  @observable user: null | User = null;
  @observable logging: boolean = false;


  @action
  async fetchUser() {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<User>(this.endpoint);

    runInAction(() => {
      if (typeof response !== 'boolean') {
        this.user = response.data;
        this.logging = false;
      }
    });
  }
}

export { UserStore };
