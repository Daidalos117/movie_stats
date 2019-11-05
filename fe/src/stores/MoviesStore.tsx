// src/stores/theme-store.tsx
import { action, runInAction } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';


export interface Movie {
  username: string;
  trakt: {
    id: string;
    status: boolean;
    access_token: string;
    vip: boolean;
  };
}

type Movies = Movie[];

class MoviesStore extends ApiStore<Movies> {

  endpoint = 'movie';


  @action
  async fetchMovies() {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Movies>(this.endpoint);

    runInAction(() => {
      if (typeof response !== 'boolean') {
        this.data = response.data;
      }
    });
  }
}

export { MoviesStore };
