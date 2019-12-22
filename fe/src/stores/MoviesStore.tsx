// src/stores/theme-store.tsx
import { action, runInAction } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';
import { History } from './HistoryStore';

export interface Movie {
  _id: string;
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  createdAt: string;
  updatedAt: string;
  histories: History[];
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
