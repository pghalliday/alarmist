import _ from 'lodash';
import Log from './log';

function jobContent(status) {
  const name = status.name;
  const id = status.id;
  const error = _.isUndefined(status.error) ? 'ok' : status.error;
  const message = _.isUndefined(status.endTime) ? 'pending' : error;
  return ` ${name}: run ${id}: ${message}`;
}

function jobBg(status) {
  const error = _.isUndefined(status.error) ? 'green' : 'red';
  return _.isUndefined(status.endTime) ? 'yellow' : error;
}

export default class Job extends Log {
  constructor() {
    super();
  }
  _update(status) {
    this.setHeader(
      jobContent(status),
      jobBg(status),
    );
    this.setLog(status.log);
  }
}
