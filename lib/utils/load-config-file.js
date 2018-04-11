'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modulePath = require('./module-path');

var _modulePath2 = _interopRequireDefault(_modulePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(configFile) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!configFile) {
              _context.next = 10;
              break;
            }

            _context.prev = 1;
            return _context.abrupt('return', require((0, _modulePath2.default)(configFile)));

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', {});

          case 8:
            _context.next = 11;
            break;

          case 10:
            return _context.abrupt('return', {});

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 5]]);
  }));

  function loadConfigFile(_x) {
    return _ref.apply(this, arguments);
  }

  return loadConfigFile;
}();