'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKeysService = createKeysService;

var _actions = require('../actions.js');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createKeysService(keys, store) {
  var _keyHandlers;

  var keyHandlers = (_keyHandlers = {}, _defineProperty(_keyHandlers, '\x1B[A', function A() {
    return store.dispatch((0, _actions.up)());
  }), _defineProperty(_keyHandlers, '\x1B[B', function B() {
    return store.dispatch((0, _actions.down)());
  }), _defineProperty(_keyHandlers, '\x1B[C', function C() {
    return store.dispatch((0, _actions.expand)());
  }), _defineProperty(_keyHandlers, '\x1B[D', function D() {
    return store.dispatch((0, _actions.collapse)());
  }), _keyHandlers);
  var onKeyPress = function onKeyPress(key) {
    keyHandlers[key.sequence]();
  };
  keys.on('keypress', onKeyPress);
  return {
    stop: function stop() {
      keys.removeListener('keypress', onKeyPress);
    }
  };
}