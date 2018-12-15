"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobLabel = void 0;

var _constants = require("./constants");

const jobLabel = name => `${_constants.JOB_LABEL_PREFIX}${name}`;

exports.jobLabel = jobLabel;