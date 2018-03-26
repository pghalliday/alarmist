import _ from 'lodash';
import Log from './log';

function jobContent(status) {
  const name = status.name;
  const error = _.isUndefined(status.error) ? 'ended' : status.error;
  const message = _.isUndefined(status.endTime) ? 'ok' : error;
  return ` ${name}: ${message}`;
}

function jobBg(status) {
  return _.isUndefined(status.endTime) ? 'green' : 'red';
}

export default class Service extends Log {
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
