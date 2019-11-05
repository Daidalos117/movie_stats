// src/stores/theme-store.tsx
import { action, runInAction } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';
import { Movie } from './MoviesStore';
import { API } from '../routes';

export interface History {
  watched_at: string;
  movie: Movie;

}

type Histories = History[];

class HistoryStore extends ApiStore<Histories> {
  endpoint = API.history.index;

  @action
  fetchHistory = async () => {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Histories>(this.endpoint);

    runInAction(() => {
      if (typeof response !== 'boolean') {
        this.data = response.data;
      }
    });
  }
}

export { HistoryStore };
