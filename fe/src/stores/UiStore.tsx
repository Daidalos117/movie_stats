import { ApiStore } from './ApiStore';
import { observable } from 'mobx';


class UiStore {
  @observable
  menuBack: undefined | string;

  @observable
  theme: boolean = false; // 0 -> dark ; 1 -> light
}

export { UiStore };
