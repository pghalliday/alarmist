'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitorService = createMonitorService;

var _actions = require('../actions.js');

function createMonitorService(monitor, store) {
  var onExit = function onExit(code) {
    store.dispatch((0, _actions.exit)(code));
  };
  var onUpdate = function onUpdate(status) {
    store.dispatch((0, _actions.update)(status));
  };
  monitor.on('exit', onExit);
  monitor.on('update', onUpdate);
  return {
    stop: function stop() {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('update', onUpdate);
    }
  };
}