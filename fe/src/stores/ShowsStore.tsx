// src/stores/theme-store.tsx
import { observable, runInAction, action } from 'mobx';
import { ApiStore } from './ApiStore';
import { RefObject } from 'react';
import { Query } from 'material-table';
import { stores } from './store';
import { API } from '../routes';
import api from '../api/backend';

interface Ids {
  trakt: number;
  slug: string;
  imdb: string;
  tmdb: number;
  tvrage: number;
}

export interface Episode {
  _id: string;
  season: number;
  number: number;
  title: string;
  ids: Ids;
  histories: History[];
}

export interface Show {
  _id: string;
  title: string;
  year: number;
  ids: Ids;
  createdAt: string;
  updatedAt: string;
  histories: History[];
}

type Shows = Show[];

export interface History {
  watched_at: string;
  show: Show;
}

type Histories = History[];

type OpenSeason = string | null;

class ShowsStore extends ApiStore {
  endpoint = 'show';

  @observable tableRef: RefObject<any> | null = null;

  @observable query: Query<Show> | null = null;

  @observable _openSeason: OpenSeason = null;

  @observable openedEpisodes: number[] = [];

  @observable syncing: boolean = false;

  set openSeason(season: OpenSeason) {
    this._openSeason = season;
    this.openedEpisodes = [];
  }

  get openSeason(): OpenSeason {
    return this._openSeason;
  }

  addOpenEpisode = (episodeNumber: number) => {
    this.openedEpisodes.push(episodeNumber);
  };

  removeOpenEpisode = (episodeNumber: number) =>
    (this.openedEpisodes = this.openedEpisodes.filter(
      episode => episode === episodeNumber
    ));

  @action
  syncWithApi = async () => {
    this.syncing = true;
    const resp = await api.get<number>(
      `${API.show.index}/${API.show.syncItemsCount}`,
      {}
    );
    const { data: newDataCount } = resp;

    if (newDataCount) {
      const itemsPerPage = process.env.REACT_APP_ITEMS_PER_PAGE_SYNC || 20;

      const pages = Math.ceil(newDataCount / itemsPerPage);

      let newData = [];
      for (let page = pages; page > 0; page--) {
        try {
          let data = await api.get<number>(
            `${API.show.index}/${API.show.pagedSync}`,
            {
              params: {
                page,
                itemsPerPage
              }
            }
          );
          console.log(data);
        } catch (e) {
          console.error('error syncing shows', e);
          page++;
        }
      }
    }

    this.syncing = false;
    return resp;
  };

  syncData = async () => {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Histories>(
      `${this.endpoint}/${API.show.sync}`
    );

    return runInAction(() => {
      return response;
    });
  };
}

export { ShowsStore };
