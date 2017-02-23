'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobLabel = undefined;

var _constants = require('./constants');

var jobLabel = exports.jobLabel = function jobLabel(name) {
  return '' + _constants.JOB_LABEL_PREFIX + name;
};