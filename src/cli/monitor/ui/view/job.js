import _ from 'lodash';
import Log from './log';

function jobContent(status) {
  const name = status.name;
  if (status.service) {
    const error = _.isUndefined(status.error) ? 'ended' : status.error;
    const message = _.isUndefined(status.endTime) ? 'ok' : error;
    return ` ${name}: ${message}`;
  }
  const id = status.id;
  const error = _.isUndefined(status.error) ? 'ok' : status.error;
  const message = _.isUndefined(status.endTime) ? 'pending' : error;
  return ` ${name}: run ${id}: ${message}`;
}

function jobBg(status) {
  if (status.service) {
    return _.isUndefined(status.endTime) ? 'green' : 'red';
  }
  const error = _.isUndefined(status.error) ? 'green' : 'red';
  return _.isUndefined(status.endTime) ? 'yellow' : error;
}

export default class Job extends Log {
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
