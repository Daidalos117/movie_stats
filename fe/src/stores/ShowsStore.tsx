// src/stores/theme-store.tsx
import {action, observable, runInAction} from 'mobx';
import { ApiStore } from './ApiStore';
import { stores } from './store';
import {API} from "../routes";
import {RefObject} from "react";
import {Query} from "material-table";

export interface Show {
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

type Shows = Show[];

export interface History {
  watched_at: string;
  show: Show;
}

type Histories = History[];


class ShowsStore extends ApiStore {
  endpoint = 'show';

  @observable tableRef: RefObject<any> | null = null;

  @observable query: Query<Show> | null = null;


}

export { ShowsStore };
