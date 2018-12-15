"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optionDefault;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optionDefault(envVar, defaultValue, transform) {
  let envValue = process.env[envVar];

  if (_lodash.default.isUndefined(envValue)) {
    return defaultValue;
  }

  if (transform) {
    envValue = transform(envValue);
  }

  return envValue;
}