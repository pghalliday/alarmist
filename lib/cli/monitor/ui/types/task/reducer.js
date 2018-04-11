'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskEnd = exports.taskLog = exports.taskStart = undefined;
exports.default = createReducer;

var _reduxActions = require('redux-actions');

var _reselect = require('reselect');

var _reducer = require('../common/reducer');

var _createActions = (0, _reduxActions.createActions)('TASK_START', 'TASK_LOG', 'TASK_END'),
    taskStart = _createActions.taskStart,
    taskLog = _createActions.taskLog,
    taskEnd = _createActions.taskEnd;

exports.taskStart = taskStart;
exports.taskLog = taskLog;
exports.taskEnd = taskEnd;


function headerText(name, id, message) {
  return name + ': run ' + id + ': ' + message;
}

function createReducer(name, type) {
  var idSelector = function idSelector(state) {
    return state.id;
  };
  var nameSelector = function nameSelector(state) {
    return state.name;
  };
  var runningSelector = function runningSelector(state) {
    return state.running;
  };
  var errorSelector = function errorSelector(state) {
    return state.error;
  };
  var headerSelector = (0, _reselect.createSelector)(nameSelector, idSelector, runningSelector, errorSelector, function (name, id, running, error) {
    if (running) {
      return {
        text: headerText(name, id, 'running'),
        bgcolor: 'yellow',
        fgcolor: 'black'
      };
    }
    if (error) {
      return {
        text: headerText(name, id, error),
        bgcolor: 'red',
        fgcolor: 'black'
      };
    }
    return {
      text: headerText(name, id, 'ok'),
      bgcolor: 'green',
      fgcolor: 'black'
    };
  });
  var logSelector = function logSelector(state) {
    return state.log;
  };
  return (0, _reducer.createReducer)({
    name: name,
    type: type,
    start: taskStart,
    log: taskLog,
    end: taskEnd,
    headerSelector: headerSelector,
    logSelector: logSelector
  });
}