'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogSocket = exports.getControlSocket = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controlSocket = _path2.default.join(_constants.WORKING_DIR, _constants.CONTROL_SOCKET);
var logSocket = _path2.default.join(_constants.WORKING_DIR, _constants.LOG_SOCKET);

// istanbul ignore next
function getControlSocket() {
  if (process.platform === 'win32') {
    // windows uses named pipes
    return _constants.CONTROL_NAMED_PIPE;
  } else {
    // Otherwise use a unix socket
    return controlSocket;
  }
}

// istanbul ignore next
function getLogSocket() {
  if (process.platform === 'win32') {
    // windows uses named pipes
    return _constants.LOG_NAMED_PIPE;
  } else {
    // Otherwise use a unix socket
    return logSocket;
  }
}

exports.getControlSocket = getControlSocket;
exports.getLogSocket = getLogSocket;