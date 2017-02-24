'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = createMonitor;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _entry = require('./entry');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMonitor(service, layout) {
  var entry = (0, _entry.createEntry)(_constants.MONITOR_LABEL, layout);
  entry.clear();
  service.subscribeMonitorLog(function (data) {
    entry.log(data);
  });
  return {
    update: function update(state) {
      if (_lodash2.default.isUndefined(state.exitCode)) {
        entry.setHeader(' monitor: ok', 'green');
      } else {
        entry.setHeader(' monitor: exited: ' + state.exitCode, 'red');
      }
    }
  };
}