'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createService = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createService(_ref) {
  var _this = this;

  var monitor = _ref.monitor,
      store = _ref.store,
      types = _ref.types;

  types = _lodash2.default.mapValues(types, function (type) {
    return type.createService(store);
  });

  var createAction = function createAction(name) {
    return function (status) {
      _logger2.default.debug(status);
      var type = types[status.type];
      // istanbul ignore else
      if (type) {
        type[name](status);
      } else {
        _logger2.default.log('No service available for this type of entry: ' + type);
      }
    };
  };

  var onStart = createAction('start');
  var onEnd = createAction('end');
  var onLog = createAction('log');

  monitor.on('start', onStart);
  monitor.on('end', onEnd);
  monitor.on('log', onLog);
  return {
    stop: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                monitor.removeListener('start', onStart);
                monitor.removeListener('end', onEnd);
                monitor.removeListener('log', onLog);
                _context.next = 5;
                return monitor.close();

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function stop() {
        return _ref2.apply(this, arguments);
      }

      return stop;
    }()
  };
}