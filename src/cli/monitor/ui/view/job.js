import _ from 'lodash';
import Entry from './entry';

function jobContent(status) {
  const name = status.name;
  const id = status.id;
  let message;
  if (status.service) {
    const error = _.isUndefined(status.error) ? 'ended' : status.error;
    message = _.isUndefined(status.endTime) ? 'ok' : error;
  } else {
    const error = _.isUndefined(status.error) ? 'ok' : status.error;
    message = _.isUndefined(status.endTime) ? 'pending' : error;
  }
  return ` ${name}: run ${id}: ${message}`;
}

function jobBg(status) {
  if (status.service) {
    return _.isUndefined(status.endTime) ? 'green' : 'red';
  }
  const error = _.isUndefined(status.error) ? 'green' : 'red';
  return _.isUndefined(status.endTime) ? 'yellow' : error;
}

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
