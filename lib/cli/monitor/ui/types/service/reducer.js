'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceEnd = exports.serviceLog = exports.serviceStart = undefined;
exports.default = createReducer;

var _reduxActions = require('redux-actions');

var _reselect = require('reselect');

var _reducer = require('../common/reducer');

var _createActions = (0, _reduxActions.createActions)('SERVICE_START', 'SERVICE_LOG', 'SERVICE_END'),
    serviceStart = _createActions.serviceStart,
    serviceLog = _createActions.serviceLog,
    serviceEnd = _createActions.serviceEnd;

exports.serviceStart = serviceStart;
exports.serviceLog = serviceLog;
exports.serviceEnd = serviceEnd;


function headerText(name, message) {
  return name + ': ' + message;
}

function createReducer(name, type) {
  var nameSelector = function nameSelector(state) {
    return state.name;
  };
  var runningSelector = function runningSelector(state) {
    return state.running;
  };
  var errorSelector = function errorSelector(state) {
    return state.error;
  };
  var headerSelector = (0, _reselect.createSelector)(nameSelector, runningSelector, errorSelector, function (name, running, error) {
    if (running) {
      return {
        text: headerText(name, 'ok'),
        bgcolor: 'green',
        fgcolor: 'black'
      };
    }
    if (error) {
      return {
        text: headerText(name, 'exited: ' + error),
        bgcolor: 'red',
        fgcolor: 'black'
      };
    }
    return {
      text: headerText(name, 'exited'),
      bgcolor: 'red',
      fgcolor: 'black'
    };
  });
  var logSelector = function logSelector(state) {
    return state.log;
  };
  return (0, _reducer.createReducer)({
    name: name,
    type: type,
    start: serviceStart,
    log: serviceLog,
    end: serviceEnd,
    headerSelector: headerSelector,
    logSelector: logSelector
  });
}