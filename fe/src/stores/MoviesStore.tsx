// src/stores/theme-store.tsx
import { action, runInAction } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';

export interface Movie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
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
