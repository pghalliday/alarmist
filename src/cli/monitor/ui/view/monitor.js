import _ from 'lodash';
import Log from './log';

export default class Monitor extends Log {
  constructor() {
    super();
  }
  _update(state) {
    if (_.isUndefined(state.error)) {
      this.setHeader(
        ' monitor: ok',
        'green',
      );
    } else {
      this.setHeader(
        ` monitor: ${state.error}`,
        'red',
      );
    }
    this.setLog(state.log);
  }
}
