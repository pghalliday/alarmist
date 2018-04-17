'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineEnd = exports.lineValue = exports.lineAdvance = exports.lineStart = undefined;
exports.default = createReducer;

var _lodash = require('lodash');

var _reduxActions = require('redux-actions');

var _reselect = require('reselect');

var _reducer = require('../common/reducer');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _createActions = (0, _reduxActions.createActions)('LINE_START', 'LINE_ADVANCE', 'LINE_VALUE', 'LINE_END'),
    lineStart = _createActions.lineStart,
    lineAdvance = _createActions.lineAdvance,
    lineValue = _createActions.lineValue,
    lineEnd = _createActions.lineEnd;

exports.lineStart = lineStart;
exports.lineAdvance = lineAdvance;
exports.lineValue = lineValue;
exports.lineEnd = lineEnd;


function headerText(name, message) {
  return name + ': ' + message;
}

function appendValue(values, value, length) {
  var oldLength = values.length;
  if (oldLength === 0) {
    return Array(length).fill(value);
  }
  if (oldLength === length) {
    var _newValues = values.slice(0, -1);
    _newValues.push(value);
    return _newValues;
  }
  var newValues = values.slice();
  var lengthDiff = length - oldLength;
  if (lengthDiff > 1) {
    var lastValue = values[oldLength - 1];
    var increment = (value - lastValue) / lengthDiff;
    for (var i = 1; i < lengthDiff; i++) {
      newValues.push(lastValue + increment * i);
    }
    newValues.push(value);
  }
  return newValues;
}

function updateErrorSeries(errorSeries, series, error) {
  var newErrorSeries = (0, _lodash.without)(errorSeries, series);
  if (error) {
    newErrorSeries.unshift(series);
  }
  return newErrorSeries;
}

function createReducer(name, type) {
  var _handleActions;

  var nameSelector = function nameSelector(state) {
    return state.name;
  };
  var runningSelector = function runningSelector(state) {
    return state.running;
  };
  var errorSelector = function errorSelector(state) {
    return state.error;
  };
  var errorSeriesSelector = function errorSeriesSelector(state) {
    return state.errorSeries;
  };
  var lastSeriesSelector = function lastSeriesSelector(state) {
    return state.lastSeries;
  };
  var seriesSelector = function seriesSelector(state) {
    return state.series;
  };
  var xSelector = function xSelector(state) {
    return state.x;
  };
  var seriesErrorSelector = (0, _reselect.createSelector)(errorSeriesSelector, function (errorSeries) {
    return errorSeries[0];
  });
  var headerSelector = (0, _reselect.createSelector)(nameSelector, runningSelector, errorSelector, seriesErrorSelector, lastSeriesSelector, seriesSelector, function (name, running, error, seriesError, lastSeries, series) {
    if (running) {
      if (seriesError) {
        var _series = series[seriesError];
        var _error = _series.error;
        var _value = _series.values[_series.values.length - 1];
        return {
          text: headerText(name, seriesError + ': ' + _value + ': ' + _error),
          bgcolor: 'red',
          fgcolor: 'black'
        };
      } else {
        if (lastSeries) {
          var _series2 = series[lastSeries];
          var _value2 = _series2.values[_series2.values.length - 1];
          return {
            text: headerText(name, lastSeries + ': ' + _value2),
            bgcolor: 'green',
            fgcolor: 'black'
          };
        } else {
          return {
            text: headerText(name, 'ready'),
            bgcolor: 'green',
            fgcolor: 'black'
          };
        }
      }
    }
    if (error) {
      return {
        text: headerText(name, 'exited: ' + error),
        bgcolor: 'red',
        fgcolor: 'black'
      };
    }
    return {
      text: headerText(name, 'exited'),
      bgcolor: 'red',
      fgcolor: 'black'
    };
  });
  var dataSelector = (0, _reselect.createSelector)(seriesSelector, xSelector, function (series, length, x) {
    var data = [];
    (0, _lodash.forOwn)(series, function (series, title) {
      data.push({
        title: title,
        style: {
          line: series.error ? 'red' : 'green'
        },
        x: x.slice(0, series.values.length),
        y: series.values
      });
    });
    return data;
  });

  var INITIAL_STATE = {
    name: name,
    type: type,
    id: 0,
    running: false,
    series: {},
    errorSeries: [],
    lastSeries: undefined,
    error: undefined,
    x: [],
    selectors: {
      header: headerSelector,
      data: dataSelector
    }
  };

  return (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, lineStart, function (state, _ref) {
    var payload = _ref.payload;
    return (0, _reducer.check)(_reducer.gt, state, payload, function () {
      return Object.assign({}, state, {
        id: payload.id,
        running: true,
        series: {},
        errorSeries: [],
        error: undefined
      });
    });
  }), _defineProperty(_handleActions, lineAdvance, function (state, _ref2) {
    var payload = _ref2.payload;
    return (0, _reducer.check)(_reducer.eq, state, payload, function () {
      return Object.assign({}, state, {
        x: state.x.concat([state.x.length])
      });
    });
  }), _defineProperty(_handleActions, lineValue, function (state, _ref3) {
    var payload = _ref3.payload;
    return (0, _reducer.check)(_reducer.eq, state, payload, function () {
      var series = state.series[payload.series];
      var values = appendValue(series ? series.values : [], payload.value, state.x.length);
      var errorSeries = updateErrorSeries(state.errorSeries, payload.series, payload.error);
      return Object.assign({}, state, {
        series: Object.assign({}, state.series, _defineProperty({}, payload.series, {
          error: payload.error,
          values: values
        })),
        lastSeries: payload.series,
        errorSeries: errorSeries
      });
    });
  }), _defineProperty(_handleActions, lineEnd, function (state, _ref4) {
    var payload = _ref4.payload;
    return (0, _reducer.check)(_reducer.eq, state, payload, function () {
      return Object.assign({}, state, {}, {
        running: false,
        error: payload.error
      });
    });
  }), _handleActions), INITIAL_STATE);
}