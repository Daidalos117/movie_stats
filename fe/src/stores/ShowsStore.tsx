// src/stores/theme-store.tsx
import { computed, observable } from 'mobx';
import { ApiStore } from './ApiStore';
import { RefObject } from 'react';
import { Query } from 'material-table';

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
}

export { ShowsStore };
