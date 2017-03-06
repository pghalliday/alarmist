import _ from 'lodash';
import Entry from './entry';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: run ${status.id}: ${_.isUndefined(status.endTime) ? 'pending' : (_.isUndefined(status.error) ? 'ok' : status.error)}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.endTime) ? 'yellow' : (_.isUndefined(status.error) ? 'green' : 'red');

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
