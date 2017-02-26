import _ from 'lodash';
import Entry from './entry';

export default class Monitor extends Entry {
  _update(state) {
    if (_.isUndefined(state.exitCode)) {
      this.setHeader(
        ' monitor: ok',
        'green',
      );
    } else {
      this.setHeader(
        ` monitor: exited: ${state.exitCode}`,
        'red',
      );
    }
    this.setLog(state.log);
  }
}
