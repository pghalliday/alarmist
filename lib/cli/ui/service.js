'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require('./redux/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createService(monitor, store) {
  var onExit = function onExit(code) {
    store.dispatch((0, _actions.exit)(code));
  };
  var onStart = function onStart(status) {
    store.dispatch((0, _actions.start)(status));
  };
  var onEnd = function onEnd(status) {
    store.dispatch((0, _actions.end)(status));
  };
  var onJobLog = function onJobLog(logData) {
    store.dispatch((0, _actions.jobLog)(logData));
  };
  var onMonitorLog = function onMonitorLog(data) {
    store.dispatch((0, _actions.monitorLog)(data));
  };
  monitor.on('exit', onExit);
  monitor.on('start', onStart);
  monitor.on('end', onEnd);
  monitor.on('log', onJobLog);
  monitor.stdout.on('data', onMonitorLog);
  monitor.stderr.on('data', onMonitorLog);
  return {
    stop: function stop() {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('start', onStart);
      monitor.removeListener('end', onEnd);
      monitor.removeListener('log', onJobLog);
      monitor.stdout.removeListener('data', onMonitorLog);
      monitor.stderr.removeListener('data', onMonitorLog);
    }
  };
}