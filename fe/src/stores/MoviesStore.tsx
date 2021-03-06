// src/stores/theme-store.tsx
import { observable, runInAction} from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';
import {API} from "../routes";
import {RefObject} from "react";
import {Query} from "material-table";

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

export interface History {
  watched_at: string;
  movie: Movie;
}

type Histories = History[];


class MoviesStore extends ApiStore {
  endpoint = 'movie';

  @observable tableRef: RefObject<any> | null = null;

  @observable query: Query<Movie> | null = null;


  syncData = async () => {
    const { apiStore } = stores;

    const response = await apiStore.fetchData<Histories>(`${this.endpoint}/${API.movie.sync}`);

    return runInAction(() => {
      return response;
    });
  }


}

export { MoviesStore };
