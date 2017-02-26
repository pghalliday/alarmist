import _ from 'lodash';
import Entry from './entry';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: run ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : (status.exitCode === 0 ? 'ok' : 'exit code ' + status.exitCode)}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');

export default class Job extends Entry {
  constructor() {
    super();
    this.type = 'Job';
  }
  _update(status) {
    this.setHeader(
      jobContent(status),
      jobBg(status),
    );
    this.setLog(status.log);
  }
}
