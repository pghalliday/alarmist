'use strict';

var _reduxActions = require('redux-actions');

module.exports = (0, _reduxActions.createActions)({
  RESET: function RESET() {
    return undefined;
  },
  UPDATE_JOB: function UPDATE_JOB(job) {
    return job;
  }
});