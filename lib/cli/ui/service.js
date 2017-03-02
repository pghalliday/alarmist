'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require('./redux/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createService(monitor, store) {
  var _this = this;

  var onExit = function onExit(code) {
    store.dispatch((0, _actions.exit)(code));
  };
  var onStart = function onStart(status) {
    store.dispatch((0, _actions.start)(status));
  };
  var onEnd = function onEnd(status) {
    store.dispatch((0, _actions.end)(status));
  };
  var onJobLog = function onJobLog(logData) {
    store.dispatch((0, _actions.jobLog)(logData));
  };
  var onMonitorLog = function onMonitorLog(data) {
    store.dispatch((0, _actions.monitorLog)(data));
  };
  monitor.on('exit', onExit);
  monitor.on('start', onStart);
  monitor.on('end', onEnd);
  monitor.on('log', onJobLog);
  monitor.log.on('data', onMonitorLog);
  return {
    stop: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                monitor.removeListener('exit', onExit);
                monitor.removeListener('start', onStart);
                monitor.removeListener('end', onEnd);
                monitor.removeListener('log', onJobLog);
                monitor.log.removeListener('data', onMonitorLog);
                _context.next = 7;
                return monitor.close();

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function stop() {
        return _ref.apply(this, arguments);
      }

      return stop;
    }()
  };
}