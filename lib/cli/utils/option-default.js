'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optionDefault;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optionDefault(envVar, defaultValue, transform) {
  var envValue = process.env[envVar];
  if (_lodash2.default.isUndefined(envValue)) {
    return defaultValue;
  }
  if (transform) {
    envValue = transform(envValue);
  }
  return envValue;
}