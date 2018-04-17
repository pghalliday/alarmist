import Service from '../common/service';
import {
  lineStart,
  lineColors,
  lineAdvance,
  lineValue,
  lineEnd,
} from './reducer';

class ServiceService extends Service {
  start(status) {
    super.start(status);
    this.store.dispatch(lineStart(status));
  }
  log(status) {
  }
  end(status) {
    this.store.dispatch(lineEnd(status));
  }
}

export default function createService(store) {
  return new ServiceService(store);
}
