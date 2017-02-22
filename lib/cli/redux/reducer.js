'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleActions, _handleActions2;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redux = require('redux');

var _reduxActions = require('redux-actions');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialMonitor = {};

var monitor = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _actions.reset, function () {
  return initialMonitor;
}), _defineProperty(_handleActions, _actions.exit, function (monitor, _ref) {
  var payload = _ref.payload;
  return { exitCode: payload };
}), _handleActions), initialMonitor);

var initialJobs = [];

var jobs = (0, _reduxActions.handleActions)((_handleActions2 = {}, _defineProperty(_handleActions2, _actions.reset, function () {
  return initialJobs;
}), _defineProperty(_handleActions2, _actions.update, function (jobs, _ref2) {
  var payload = _ref2.payload;

  var index = _lodash2.default.findIndex(jobs, { name: payload.name });
  if (index !== -1) {
    var existingJob = jobs[index];
    if (existingJob.id > payload.id) {
      return jobs;
    }
    return _lodash2.default.concat(jobs.slice(0, index), Object.assign({}, payload), jobs.slice(index + 1));
  }
  return _lodash2.default.concat(jobs, Object.assign({}, payload));
}), _handleActions2), initialJobs);

exports.default = (0, _redux.combineReducers)({
  monitor: monitor,
  jobs: jobs
});