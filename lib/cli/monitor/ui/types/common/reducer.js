'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;

var _reduxActions = require('redux-actions');

var _appendBuffer = require('../../../../utils/append-buffer');

var _appendBuffer2 = _interopRequireDefault(_appendBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EMPTY_BUFFER = Buffer.alloc(0);
var MAX_LOG_SIZE = 100000;

var gt = function gt(a, b) {
  return a > b;
};
var eq = function eq(a, b) {
  return a === b;
};
function check(op, state, payload, callback) {
  if (payload.name === state.name && op(payload.id, state.id)) {
    return callback(state, payload);
  } else {
    return state;
  }
}

function createReducer(_ref) {
  var _handleActions;

  var name = _ref.name,
      type = _ref.type,
      start = _ref.start,
      log = _ref.log,
      end = _ref.end,
      headerSelector = _ref.headerSelector,
      logSelector = _ref.logSelector;

  var INITIAL_STATE = {
    name: name,
    type: type,
    id: 0,
    running: false,
    log: EMPTY_BUFFER,
    error: undefined,
    selectors: {
      header: headerSelector,
      log: logSelector
    }
  };

  return (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, start, function (state, _ref2) {
    var payload = _ref2.payload;
    return check(gt, state, payload, function () {
      return Object.assign({}, state, {
        id: payload.id,
        log: EMPTY_BUFFER,
        running: true,
        error: undefined
      });
    });
  }), _defineProperty(_handleActions, log, function (state, _ref3) {
    var payload = _ref3.payload;
    return check(eq, state, payload, function () {
      return Object.assign({}, state, {
        log: (0, _appendBuffer2.default)(MAX_LOG_SIZE, state.log, payload.data)
      });
    });
  }), _defineProperty(_handleActions, end, function (state, _ref4) {
    var payload = _ref4.payload;
    return check(eq, state, payload, function () {
      return Object.assign({}, state, {
        running: false,
        error: payload.error
      });
    });
  }), _handleActions), INITIAL_STATE);
}