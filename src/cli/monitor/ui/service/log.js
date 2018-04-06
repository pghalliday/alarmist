import Run from './run';

import {
  runLog,
} from '../redux/actions';

export default class Log extends Run {
  log(logData) {
    this.store.dispatch(runLog(logData));
  }
}
