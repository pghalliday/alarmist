'use strict';

var _reduxActions = require('redux-actions');

module.exports = (0, _reduxActions.createActions)({
  RESET: function RESET() {
    return undefined;
  },
  START: function START(status) {
    return status;
  },
  END: function END(status) {
    return status;
  },
  EXIT: function EXIT(code) {
    return code;
  },
  UP: function UP() {
    return undefined;
  },
  DOWN: function DOWN() {
    return undefined;
  },
  TOGGLE_EXPANDED: function TOGGLE_EXPANDED() {
    return undefined;
  },
  MONITOR_LOG: function MONITOR_LOG(data) {
    return data;
  },
  JOB_LOG: function JOB_LOG(logData) {
    return logData;
  }
});