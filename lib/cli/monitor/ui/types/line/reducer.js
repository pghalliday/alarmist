'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineEnd = exports.linePoint = exports.lineStart = undefined;
exports.default = createReducer;

var _lodash = require('lodash');

var _reduxActions = require('redux-actions');

var _reselect = require('reselect');

var _reducer = require('../common/reducer');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _createActions = (0, _reduxActions.createActions)('LINE_START', 'LINE_POINT', 'LINE_END'),
    lineStart = _createActions.lineStart,
    linePoint = _createActions.linePoint,
    lineEnd = _createActions.lineEnd;

exports.lineStart = lineStart;
exports.linePoint = linePoint;
exports.lineEnd = lineEnd;


function headerText(name, message) {
  return name + ': ' + message;
}

function appendValue(values, value, minLength) {
  if (values.length === 0) {
    return Array(minLength || 1).fill(value);
  }
  var lastValue = values[values.length - 1];
  var shortage = minLength - (values.length + 1);
  var newValues = Array(shortage).fill(lastValue);
  newValues.push(value);
  return values.concat(newValues);
}

function updateErrorSeries(errorSeries, series, error) {
  var newErrorSeries = (0, _lodash.without)(errorSeries, series);
  if (error) {
    newErrorSeries.unshift(series);
  }
  return newErrorSeries;
}

function extendX(x, length, newLength) {
  if (newLength > length) {
    var extra = [];
    for (var i = length; i < newLength; i++) {
      extra.push(i);
    }
    return x.concat(extra);
  }
  return x;
}

function extendValues(values, length) {
  var shortage = length - values.length;
  if (shortage) {
    var lastValue = values[values.length - 1];
    return values.concat(Array(shortage).fill(lastValue));
  }
  return values;
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
  var lengthSelector = function lengthSelector(state) {
    return state.length;
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
  var dataSelector = (0, _reselect.createSelector)(seriesSelector, lengthSelector, xSelector, function (series, length, x) {
    var data = [];
    (0, _lodash.forOwn)(series, function (series, title) {
      data.push({
        title: title,
        style: {
          line: series.error ? 'red' : 'green'
        },
        x: x,
        y: extendValues(series.values, length)
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
    length: 0,
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
  }), _defineProperty(_handleActions, linePoint, function (state, _ref2) {
    var payload = _ref2.payload;
    return (0, _reducer.check)(_reducer.eq, state, payload, function () {
      var series = state.series[payload.series];
      var values = appendValue(series ? series.values : [], payload.value, state.length);
      var errorSeries = updateErrorSeries(state.errorSeries, payload.series, payload.error);
      var length = Math.max(state.length, values.length);
      var x = extendX(state.x, state.length, length);
      return Object.assign({}, state, {
        series: Object.assign({}, state.series, _defineProperty({}, payload.series, {
          error: payload.error,
          values: values
        })),
        lastSeries: payload.series,
        errorSeries: errorSeries,
        length: length,
        x: x
      });
    });
  }), _defineProperty(_handleActions, lineEnd, function (state, _ref3) {
    var payload = _ref3.payload;
    return (0, _reducer.check)(_reducer.eq, state, payload, function () {
      return Object.assign({}, state, {}, {
        running: false,
        error: payload.error
      });
    });
  }), _handleActions), INITIAL_STATE);
}