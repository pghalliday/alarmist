'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exec;

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _constants = require('../constants');

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// tree-kill gives us a cross-platform
// way to kill children and grandchildren, etc


function exec(_ref) {
  var _Object$assign,
      _this = this;

  var monitor = _ref.monitor,
      command = _ref.command,
      args = _ref.args,
      color = _ref.color,
      configFile = _ref.configFile,
      workingDir = _ref.workingDir;

  monitor.start();
  var proc = (0, _crossSpawn2.default)(command, args, {
    env: Object.assign({}, process.env, (_Object$assign = {}, _defineProperty(_Object$assign, _constants.CONFIG_FILE_VAR, configFile), _defineProperty(_Object$assign, _constants.WORKING_DIRECTORY_VAR, workingDir), _defineProperty(_Object$assign, _constants.FORCE_COLOR_VAR, color), _Object$assign))
  });
  var expectExit = false;
  var exitPromise = new Promise(function (resolve) {
    proc.on('exit', function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(code) {
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

      return function (_x) {
        return _ref2.apply(this, arguments);
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
            expectExit = true;
            (0, _treeKill2.default)(proc.pid);
            _context2.next = 4;
            return exitPromise;

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));
}