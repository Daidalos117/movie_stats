import React from 'react';
import { UserStore } from './UserStore';
import { ApiStore } from './ApiStore';
import { MoviesStore } from './MoviesStore';
import { ShowsStore } from './ShowsStore';

import { UiStore } from './UiStore';

export const stores = {
  userStore: new UserStore(),
  apiStore: new ApiStore(),
  moviesStore: new MoviesStore(),
  showsStore: new ShowsStore(),
  uiStore: new UiStore(),
};

export const storesContext =  React.createContext(stores);

export const useStores = () => React.useContext(storesContext);
