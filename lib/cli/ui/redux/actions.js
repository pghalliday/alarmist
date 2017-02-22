'use strict';

var _reduxActions = require('redux-actions');

module.exports = (0, _reduxActions.createActions)({
  RESET: function RESET() {
    return undefined;
  },
  UPDATE: function UPDATE(status) {
    return status;
  },
  EXIT: function EXIT(code) {
    return code;
  }
});