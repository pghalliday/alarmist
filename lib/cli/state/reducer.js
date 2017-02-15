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
}), _defineProperty(_handleActions, _actions.startJob, function (jobs, _ref) {
  var payload = _ref.payload;

  var index = _lodash2.default.findIndex(jobs, { name: payload.name });
  if (index !== -1) {
    var existingJob = jobs[index];
    if (existingJob.startTime > payload.startTime) {
      return jobs;
    }
    return _lodash2.default.concat(jobs.slice(0, index), _lodash2.default.create(payload, {
      selected: existingJob.selected,
      expanded: existingJob.expanded
    }), jobs.slice(index + 1));
  }
  var selected = jobs.length === 0;
  return _lodash2.default.concat(jobs, _lodash2.default.create(payload, {
    selected: selected,
    expanded: false
  }));
}), _defineProperty(_handleActions, _actions.completeJob, function (jobs, _ref2) {
  var payload = _ref2.payload;

  var index = _lodash2.default.findIndex(jobs, { name: payload.name });
  if (index !== -1) {
    var existingJob = jobs[index];
    if (existingJob.startTime > payload.startTime) {
      return jobs;
    }
    return _lodash2.default.concat(jobs.slice(0, index), _lodash2.default.create(payload, {
      selected: existingJob.selected,
      expanded: existingJob.expanded
    }), jobs.slice(index + 1));
  }
  var selected = jobs.length === 0;
  return _lodash2.default.concat(jobs, _lodash2.default.create(payload, {
    selected: selected,
    expanded: false
  }));
}), _handleActions), initialJobs);