'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _redux = require('redux');

var _reduxActions = require('redux-actions');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createReducer(types, screen) {
  var _handleActions, _handleActions2;

  var initialLayout = {
    lines: [],
    selected: 0,
    expanded: false,
    width: screen.width,
    height: screen.height
  };

  var layout = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _actions.reset, function () {
    return initialLayout;
  }), _defineProperty(_handleActions, _actions.resize, function (layout, _ref) {
    var payload = _ref.payload;

    return Object.assign({}, layout, {
      width: payload.width,
      height: payload.height
    });
  }), _defineProperty(_handleActions, _actions.start, function (layout, _ref2) {
    var payload = _ref2.payload;

    var name = payload.name;
    var lines = layout.lines;
    var index = _lodash2.default.indexOf(lines, name);
    if (index === -1) {
      return Object.assign({}, layout, {
        lines: lines.concat([name])
      });
    }
    return layout;
  }), _defineProperty(_handleActions, _actions.select, function (layout, _ref3) {
    var payload = _ref3.payload;

    var index = _lodash2.default.indexOf(layout.lines, payload);
    var changed = index !== layout.selected;
    return Object.assign({}, layout, {
      selected: index,
      expanded: changed || !layout.expanded
    });
  }), _defineProperty(_handleActions, _actions.down, function (layout) {
    var selected = layout.selected;
    var maxSelected = layout.lines.length - 1;
    if (selected < maxSelected) {
      return Object.assign({}, layout, {
        selected: selected + 1
      });
    }
    return layout;
  }), _defineProperty(_handleActions, _actions.up, function (layout) {
    var selected = layout.selected;
    if (selected > 0) {
      return Object.assign({}, layout, {
        selected: selected - 1
      });
    }
    return layout;
  }), _defineProperty(_handleActions, _actions.moveDown, function (layout) {
    var selected = layout.selected;
    var lines = layout.lines;
    var maxSelected = layout.lines.length - 1;
    if (selected < maxSelected) {
      return Object.assign({}, layout, {
        selected: selected + 1,
        lines: lines.slice(0, selected).concat(lines[selected + 1], lines[selected], lines.slice(selected + 2))
      });
    }
    return layout;
  }), _defineProperty(_handleActions, _actions.moveUp, function (layout) {
    var selected = layout.selected;
    var lines = layout.lines;
    if (selected > 0) {
      return Object.assign({}, layout, {
        selected: selected - 1,
        lines: lines.slice(0, selected - 1).concat(lines[selected], lines[selected - 1], lines.slice(selected + 1))
      });
    }
    return layout;
  }), _defineProperty(_handleActions, _actions.toggleExpanded, function (layout) {
    return Object.assign({}, layout, {
      expanded: !layout.expanded
    });
  }), _handleActions), initialLayout);

  var initialEntries = {};
  var entryReducers = {};
  var entriesReducer = null;
  var entriesRootReducer = (0, _reduxActions.handleActions)((_handleActions2 = {}, _defineProperty(_handleActions2, _actions.reset, function () {
    entryReducers = {};
    entriesReducer = null;
    return initialEntries;
  }), _defineProperty(_handleActions2, _actions.start, function (entries, _ref4) {
    var payload = _ref4.payload;

    var name = payload.name;
    if (!entryReducers[name]) {
      var type = types[payload.type];
      if (type) {
        entryReducers[name] = type.createReducer(name, payload.type);
        entriesReducer = (0, _redux.combineReducers)(entryReducers);
      } else {
        _logger2.default.log('No reducer available for this type of entry: ' + type);
      }
    }
    return entries;
  }), _handleActions2), initialEntries);
  var entries = function entries(state, action) {
    var newState = entriesRootReducer(state, action);
    if (entriesReducer) {
      return entriesReducer(newState, action);
    }
    return newState;
  };

  return (0, _redux.combineReducers)({
    entries: entries,
    layout: layout
  });
}