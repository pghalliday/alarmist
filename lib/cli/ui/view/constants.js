'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TEXT_PROPERTIES = exports.TEXT_PROPERTIES = {
  left: 2,
  width: '100%',
  height: 1,
  style: {
    fg: 'black'
  }
};

var SELECTED_INDICATOR_PROPERTIES = exports.SELECTED_INDICATOR_PROPERTIES = {
  left: 0,
  height: 1,
  content: '\u25BA'
};

var LOG_PROPERTIES = exports.LOG_PROPERTIES = {
  left: 3,
  width: '100%-2',
  height: 0,
  keys: true,
  vi: true,
  padding: {
    right: 1
  },
  scrollbar: {
    ch: ' ',
    inverse: true
  }
};

var TAIL_OPTIONS = exports.TAIL_OPTIONS = {
  fromBeginning: true
};