'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _keys = require('./keys');

var _monitor = require('./monitor');

function createService(monitor, keys, store) {
  var monitorService = (0, _monitor.createMonitorService)(monitor, store);
  var keysService = (0, _keys.createKeysService)(keys, store);
  return {
    stop: function stop() {
      monitorService.stop();
      keysService.stop();
    }
  };
}