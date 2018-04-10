import {
  start,
} from '../../redux/actions';

export default class Service {
  constructor(store) {
    this.store = store;
  }

  start(status) {
    this.store.dispatch(start(status));
  }
}
