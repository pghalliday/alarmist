'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleActions;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reduxActions = require('redux-actions');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialJobs = [];

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _actions.reset, function () {
  return initialJobs;
}), _defineProperty(_handleActions, _actions.updateJob, function (jobs, _ref) {
  var payload = _ref.payload;

  var index = _lodash2.default.findIndex(jobs, { name: payload.name });
  if (index !== -1) {
    var existingJob = jobs[index];
    if (existingJob.id > payload.id) {
      return jobs;
    }
    return _lodash2.default.concat(jobs.slice(0, index), Object.assign({}, payload), jobs.slice(index + 1));
  }
  return _lodash2.default.concat(jobs, Object.assign({}, payload));
}), _handleActions), initialJobs);