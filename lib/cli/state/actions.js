'use strict';

var _reduxActions = require('redux-actions');

module.exports = (0, _reduxActions.createActions)({
  RESET: function RESET() {
    return undefined;
  },
  START_JOB: function START_JOB(job) {
    return job;
  },
  COMPLETE_JOB: function COMPLETE_JOB(job) {
    return job;
  }
});