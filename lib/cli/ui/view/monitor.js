'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = createMonitor;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMonitor(layout) {
  var element = _blessed2.default.text(_constants.TEXT_PROPERTIES);
  layout.append(element);
  return {
    update: function update(state) {
      if (_lodash2.default.isUndefined(state.exitCode)) {
        element.content = ' monitor: ok';
        element.style.bg = 'green';
      } else {
        element.content = ' monitor: exited: ' + state.exitCode;
        element.style.bg = 'red';
      }
    }
  };
}