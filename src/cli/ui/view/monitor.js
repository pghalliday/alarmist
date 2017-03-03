import _ from 'lodash';
import Entry from './entry';

export default class Monitor extends Entry {
  constructor() {
    super();
    this.type = 'Monitor';
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
