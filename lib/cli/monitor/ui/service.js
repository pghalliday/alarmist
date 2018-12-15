"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = _interopRequireDefault(require("lodash"));

var _actions = require("./redux/actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createService(monitor, store) {
  const onEnd = code => {
    store.dispatch((0, _actions.end)(code));
  };

  const onRunStart = status => {
    store.dispatch((0, _actions.runStart)(status));
  };

  const onRunEnd = status => {
    store.dispatch((0, _actions.runEnd)(status));
  };

  const onRunLog = logData => {
    store.dispatch((0, _actions.runLog)(logData));
  };

  const onLog = data => {
    store.dispatch((0, _actions.log)(data));
  };

  monitor.on('end', onEnd);
  monitor.on('run-start', onRunStart);
  monitor.on('run-end', onRunEnd);
  monitor.on('run-log', onRunLog);
  monitor.log.on('data', onLog);
  return {
    stop: async () => {
      monitor.removeListener('end', onEnd);
      monitor.removeListener('run-start', onRunStart);
      monitor.removeListener('run-end', onRunEnd);
      monitor.removeListener('run-log', onRunLog);
      monitor.log.removeListener('data', onLog);
      await monitor.close();
    }
  };
}