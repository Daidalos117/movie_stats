import { ApiStore } from './ApiStore';
import { observable } from 'mobx';


class UiStore {
  @observable
  menuBack: null | string = null  ;

  @observable
  theme: boolean = false; // 0 -> dark ; 1 -> light
}

export { UiStore };
