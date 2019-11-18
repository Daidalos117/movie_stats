// src/stores/theme-store.tsx
import { action, runInAction, observable } from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';
import { Movie } from './MoviesStore';
import { API } from '../routes';
import {RefObject} from "react";

export interface History {
  watched_at: string;
  movie: Movie;
}

type Histories = History[];

class HistoryStore extends ApiStore<Histories> {
  endpoint = API.history.index;

  @observable tableRef: RefObject<any> | null = null;

  @action
  fetchHistory = async () => {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Histories>(this.endpoint, {
      pageSize: 1,
      page: 1
    });

    runInAction(() => {
      if (typeof response !== 'boolean') {
        this.data = response.data;
      }
    });
  }

  syncData = async () => {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Histories>(`${this.endpoint}/${API.history.sync}`);

    return runInAction(() => {
      return response;
    });
  }


}

export { HistoryStore };
