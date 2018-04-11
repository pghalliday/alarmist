import Service from '../common/service';
import {
  serviceStart,
  serviceLog,
  serviceEnd,
} from './reducer';

class ServiceService extends Service {
  start(status) {
    super.start(status);
    this.store.dispatch(serviceStart(status));
  }
  log(status) {
    this.store.dispatch(serviceLog(status));
  }
  end(status) {
    this.store.dispatch(serviceEnd(status));
  }
}

export default function createService(store) {
  return new ServiceService(store);
}
