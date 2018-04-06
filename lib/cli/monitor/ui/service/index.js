'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require('../redux/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createService(monitor, store) {
  var _this = this;

  var onEnd = function onEnd(code) {
    store.dispatch((0, _actions.end)(code));
  };
  var onRunStart = function onRunStart(status) {
    store.dispatch((0, _actions.runStart)(status));
  };
  var onRunEnd = function onRunEnd(status) {
    store.dispatch((0, _actions.runEnd)(status));
  };
  var onRunLog = function onRunLog(logData) {
    store.dispatch((0, _actions.runLog)(logData));
  };
  var onLog = function onLog(data) {
    store.dispatch((0, _actions.log)(data));
  };
  monitor.on('end', onEnd);
  monitor.on('run-start', onRunStart);
  monitor.on('run-end', onRunEnd);
  monitor.on('run-log', onRunLog);
  monitor.log.on('data', onLog);
  return {
    stop: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                monitor.removeListener('end', onEnd);
                monitor.removeListener('run-start', onRunStart);
                monitor.removeListener('run-end', onRunEnd);
                monitor.removeListener('run-log', onRunLog);
                monitor.log.removeListener('data', onLog);
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