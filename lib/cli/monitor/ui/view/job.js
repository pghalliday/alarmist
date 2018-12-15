"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _log = _interopRequireDefault(require("./log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jobContent(status) {
  const name = status.name;

  if (status.service) {
    const error = _lodash.default.isUndefined(status.error) ? 'ended' : status.error;
    const message = _lodash.default.isUndefined(status.endTime) ? 'ok' : error;
    return ` ${name}: ${message}`;
  }

  const id = status.id;
  const error = _lodash.default.isUndefined(status.error) ? 'ok' : status.error;
  const message = _lodash.default.isUndefined(status.endTime) ? 'pending' : error;
  return ` ${name}: run ${id}: ${message}`;
}

function jobBg(status) {
  if (status.service) {
    return _lodash.default.isUndefined(status.endTime) ? 'green' : 'red';
  }

  const error = _lodash.default.isUndefined(status.error) ? 'green' : 'red';
  return _lodash.default.isUndefined(status.endTime) ? 'yellow' : error;
}

class Job extends _log.default {
  constructor() {
    super();
    this.type = 'Job';
  }

  _update(status) {
    this.setHeader(jobContent(status), jobBg(status));
    this.setLog(status.log);
  }

}

exports.default = Job;