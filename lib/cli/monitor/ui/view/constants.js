"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHART_PADDING = exports.CHART_PROPERTIES = exports.LOG_PROPERTIES = exports.SELECTED_INDICATOR_PROPERTIES = exports.HEADER_PROPERTIES = exports.CONTAINER_PROPERTIES = exports.DOWN_POINTER = exports.RIGHT_POINTER = void 0;
const RIGHT_POINTER = '\u25ba';
exports.RIGHT_POINTER = RIGHT_POINTER;
const DOWN_POINTER = '\u25bc';
exports.DOWN_POINTER = DOWN_POINTER;
const CONTAINER_PROPERTIES = {
  width: '100%',
  height: '100%',
  autoFocus: false
};
exports.CONTAINER_PROPERTIES = CONTAINER_PROPERTIES;
const HEADER_PROPERTIES = {
  left: 2,
  width: '100%',
  height: 1,
  style: {
    fg: 'black'
  },
  autoFocus: false
};
exports.HEADER_PROPERTIES = HEADER_PROPERTIES;
const SELECTED_INDICATOR_PROPERTIES = {
  left: 0,
  height: 1,
  autoFocus: false
};
exports.SELECTED_INDICATOR_PROPERTIES = SELECTED_INDICATOR_PROPERTIES;
const LOG_PROPERTIES = {
  left: 3,
  width: '100%-3',
  height: 0,
  keys: true,
  mouse: true,
  vi: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  autoFocus: false
};
exports.LOG_PROPERTIES = LOG_PROPERTIES;
const CHART_PROPERTIES = {
  left: 3,
  width: '100%-3',
  height: 0,
  autoFocus: false
};
exports.CHART_PROPERTIES = CHART_PROPERTIES;
const CHART_PADDING = '          ';
exports.CHART_PADDING = CHART_PADDING;