'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = createMonitor;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _entry = require('./entry');

var _constants = require('../constants');

var _constants2 = require('../../../constants');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMonitor(layout) {
  var entry = (0, _entry.createEntry)(_constants.MONITOR_LABEL, layout);
  entry.setLog(_path2.default.join(_constants2.WORKING_DIR, _constants2.ALL_LOG));
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