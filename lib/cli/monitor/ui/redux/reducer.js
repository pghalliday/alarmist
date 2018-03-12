'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleActions, _handleActions2, _handleActions3;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appendBuffer = require('../../../utils/append-buffer');

var _appendBuffer2 = _interopRequireDefault(_appendBuffer);

var _redux = require('redux');

var _reduxActions = require('redux-actions');

var _actions = require('./actions');

var _constants = require('../constants');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MAX_BUFFER_LENGTH = 100000;

var initialMonitor = {
  log: Buffer.alloc(0)
};

var monitor = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _actions.reset, function () {
  return initialMonitor;
}), _defineProperty(_handleActions, _actions.end, function (monitor, _ref) {
  var payload = _ref.payload;

  return Object.assign({}, monitor, {
    error: payload
  });
}), _defineProperty(_handleActions, _actions.log, function (monitor, _ref2) {
  var payload = _ref2.payload;

  return Object.assign({}, monitor, {
    log: (0, _appendBuffer2.default)(MAX_BUFFER_LENGTH, monitor.log, payload)
  });
}), _handleActions), initialMonitor);

var initialJobs = {};

var jobs = (0, _reduxActions.handleActions)((_handleActions2 = {}, _defineProperty(_handleActions2, _actions.reset, function () {
  return initialJobs;
}), _defineProperty(_handleActions2, _actions.runStart, function (jobs, _ref3) {
  var payload = _ref3.payload;

  var name = payload.name;
  var existing = jobs[name];
  if (!_lodash2.default.isUndefined(existing) && existing.id > payload.id) {
    return jobs;
  }
  return Object.assign({}, jobs, _defineProperty({}, name, Object.assign({
    log: Buffer.alloc(0)
  }, payload)));
}), _defineProperty(_handleActions2, _actions.runLog, function (jobs, _ref4) {
  var payload = _ref4.payload;

  var name = payload.name;
  var job = jobs[name];
  if (!_lodash2.default.isUndefined(job) && payload.id === job.id) {
    return Object.assign({}, jobs, _defineProperty({}, name, Object.assign({}, job, {
      log: (0, _appendBuffer2.default)(MAX_BUFFER_LENGTH, job.log, payload.data)
    })));
  }
  return jobs;
}), _defineProperty(_handleActions2, _actions.runEnd, function (jobs, _ref5) {
  var payload = _ref5.payload;

  var name = payload.name;
  var job = jobs[name];
  if (!_lodash2.default.isUndefined(job) && payload.id === job.id) {
    return Object.assign({}, jobs, _defineProperty({}, name, Object.assign({}, job, payload)));
  }
  return jobs;
}), _handleActions2), initialJobs);

var initialLayout = {
  lines: [_constants.MONITOR_LABEL],
  selected: 0,
  expanded: false
};

var layout = (0, _reduxActions.handleActions)((_handleActions3 = {}, _defineProperty(_handleActions3, _actions.reset, function () {
  return initialLayout;
}), _defineProperty(_handleActions3, _actions.runStart, function (layout, _ref6) {
  var payload = _ref6.payload;

  var entry = (0, _helpers.jobLabel)(payload.name);
  var lines = layout.lines;
  var index = _lodash2.default.indexOf(lines, entry);
  if (index === -1) {
    return Object.assign({}, layout, {
      lines: lines.concat([entry])
    });
  }
  return layout;
}), _defineProperty(_handleActions3, _actions.select, function (layout, _ref7) {
  var payload = _ref7.payload;

  var index = _lodash2.default.indexOf(layout.lines, payload);
  return Object.assign({}, layout, {
    selected: index,
    expanded: true
  });
}), _defineProperty(_handleActions3, _actions.down, function (layout) {
  var selected = layout.selected;
  var maxSelected = layout.lines.length - 1;
  if (selected < maxSelected) {
    return Object.assign({}, layout, {
      selected: selected + 1
    });
  }
  return layout;
}), _defineProperty(_handleActions3, _actions.up, function (layout) {
  var selected = layout.selected;
  if (selected > 0) {
    return Object.assign({}, layout, {
      selected: selected - 1
    });
  }
  return layout;
}), _defineProperty(_handleActions3, _actions.moveDown, function (layout) {
  var selected = layout.selected;
  var lines = layout.lines;
  var maxSelected = layout.lines.length - 1;
  if (selected < maxSelected) {
    return Object.assign({}, layout, {
      selected: selected + 1,
      lines: lines.slice(0, selected).concat(lines[selected + 1], lines[selected], lines.slice(selected + 2))
    });
  }
  return layout;
}), _defineProperty(_handleActions3, _actions.moveUp, function (layout) {
  var selected = layout.selected;
  var lines = layout.lines;
  if (selected > 0) {
    return Object.assign({}, layout, {
      selected: selected - 1,
      lines: lines.slice(0, selected - 1).concat(lines[selected], lines[selected - 1], lines.slice(selected + 1))
    });
  }
  return layout;
}), _defineProperty(_handleActions3, _actions.toggleExpanded, function (layout) {
  return Object.assign({}, layout, {
    expanded: !layout.expanded
  });
}), _handleActions3), initialLayout);

exports.default = (0, _redux.combineReducers)({
  monitor: monitor,
  jobs: jobs,
  layout: layout
});