'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = undefined;

var exec = exports.exec = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref) {
    var _Object$assign,
        _this = this;

    var command = _ref.command,
        args = _ref.args,
        reset = _ref.reset,
        color = _ref.color,
        workingDir = _ref.workingDir;
    var monitor, proc, expectExit, exitPromise;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Monitor.createMonitor({
              reset: reset,
              workingDir: workingDir
            });

          case 2:
            monitor = _context3.sent;
            proc = (0, _crossSpawn2.default)(command, args, {
              env: Object.assign({}, process.env, (_Object$assign = {}, _defineProperty(_Object$assign, _constants.WORKING_DIRECTORY_VAR, workingDir), _defineProperty(_Object$assign, _constants.FORCE_COLOR_VAR, color), _Object$assign))
            });
            expectExit = false;
            exitPromise = new Promise(function (resolve) {
              proc.on('exit', function () {
                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(code) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!expectExit) {
                            delete monitor.cleanup;
                            monitor.end('exit code: ' + code);
                          }
                          resolve();

                        case 2:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }());
            });

            proc.stdout.pipe(monitor.log);
            proc.stderr.pipe(monitor.log);
            monitor.cleanup = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _logger2.default.log('cleanup');
                      expectExit = true;
                      (0, _treeKill2.default)(proc.pid);
                      _context2.next = 5;
                      return exitPromise;

                    case 5:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this);
            }));
            return _context3.abrupt('return', monitor);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function exec(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _logger = require('../cli/ui/view/logger');

var _logger2 = _interopRequireDefault(_logger);

var _monitor = require('./monitor');

var Monitor = _interopRequireWildcard(_monitor);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _constants = require('../constants');

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// tree-kill gives us a cross-platform
// way to kill children and grandchildren, etc