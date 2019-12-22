import { ApiStore } from './ApiStore';
import { observable } from 'mobx';

class UiStore {
  @observable
  menuBack: undefined | string;

}

export { UiStore };
