'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require('./redux/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createService(monitor, store) {
  var jobLogSubs = {};
  var monitorLogSubs = [];
  var onExit = function onExit(code) {
    store.dispatch((0, _actions.exit)(code));
  };
  var onUpdate = function onUpdate(status) {
    store.dispatch((0, _actions.update)(status));
  };
  var onJobLog = function onJobLog(logData) {
    var nameSubs = jobLogSubs[logData.name];
    if (nameSubs) {
      var idSubs = nameSubs[logData.id];
      if (idSubs) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = idSubs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var callback = _step.value;

            callback(logData.data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  };
  var onMonitorLog = function onMonitorLog(data) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = monitorLogSubs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var callback = _step2.value;

        callback(data);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };
  monitor.on('exit', onExit);
  monitor.on('update', onUpdate);
  monitor.on('log', onJobLog);
  monitor.stdout.on('data', onMonitorLog);
  monitor.stderr.on('data', onMonitorLog);
  return {
    stop: function stop() {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('update', onUpdate);
      monitor.removeListener('log', onJobLog);
      monitor.stdout.removeListener('data', onMonitorLog);
      monitor.stderr.removeListener('data', onMonitorLog);
    },
    subscribeMonitorLog: function subscribeMonitorLog(callback) {
      monitorLogSubs.push(callback);
      return function () {
        _lodash2.default.pull(monitorLogSubs, callback);
      };
    },
    subscribeJobLog: function subscribeJobLog(name, id, callback) {
      var nameSubs = jobLogSubs[name] = jobLogSubs[name] || {};
      var idSubs = nameSubs[id] = nameSubs[id] || [];
      idSubs.push(callback);
      return function () {
        _lodash2.default.pull(idSubs, callback);
        // istanbul ignore else
        if (idSubs.length === 0) {
          delete nameSubs[id];
          // istanbul ignore else
          if (Object.keys(nameSubs).length === 0) {
            delete jobLogSubs[name];
          }
        }
      };
    }
  };
}