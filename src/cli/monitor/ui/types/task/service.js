import Service from '../base/service';
import {
  taskStart,
  taskLog,
  taskEnd,
} from './reducer';

class TaskService extends Service {
  start(status) {
    super.start(status);
    this.store.dispatch(taskStart(status));
  }
  log(status) {
    this.store.dispatch(taskLog(status));
  }
  end(status) {
    this.store.dispatch(taskEnd(status));
  }
}

export default function createService(store) {
  return new TaskService(store);
}
