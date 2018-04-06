import {
  runStart,
  runEnd,
} from '../redux/actions';

export default class Run {
  constructor({store, status}) {
    this.store = store;
    store.dispatch(runStart(status));
  }

  end(status) {
    store.dispatch(runEnd(status));
  }
}
