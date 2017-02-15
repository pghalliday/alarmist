'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = undefined;

var createMonitor = exports.createMonitor = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var _this = this;

    var monitor;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            monitor = new _events2.default();
            _context2.next = 3;
            return rimraf(_constants.WORKING_DIR);

          case 3:
            _context2.next = 5;
            return mkdirp(_constants.WORKING_DIR);

          case 5:
            return _context2.abrupt('return', new Promise(function (resolve) {
              var watcher = _chokidar2.default.watch(_constants.WORKING_DIR + '/**').on('ready', resolve.bind(null, monitor)).on('all', function () {
                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event, filePath) {
                  var match, name, id, statusJson, status, reportDir, stdout, stderr, all;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(event === 'add' || event === 'change')) {
                            _context.next = 26;
                            break;
                          }

                          match = statusPathRegExp.exec(filePath);

                          if (!match) {
                            _context.next = 26;
                            break;
                          }

                          name = match[1];
                          id = match[2];
                          _context.next = 7;
                          return readFile(filePath);

                        case 7:
                          statusJson = _context.sent;
                          status = JSON.parse(statusJson[0]);
                          _context.t0 = status.status;
                          _context.next = _context.t0 === _constants.STATUS_PENDING ? 12 : _context.t0 === _constants.STATUS_COMPLETE ? 14 : 26;
                          break;

                        case 12:
                          monitor.emit('start', {
                            name: name,
                            id: id,
                            startTime: status.startTime
                          });
                          return _context.abrupt('break', 26);

                        case 14:
                          reportDir = _path2.default.join(_constants.WORKING_DIR, name, id);
                          _context.next = 17;
                          return readFile(_path2.default.join(reportDir, _constants.STDOUT_LOG));

                        case 17:
                          stdout = _context.sent;
                          _context.next = 20;
                          return readFile(_path2.default.join(reportDir, _constants.STDERR_LOG));

                        case 20:
                          stderr = _context.sent;
                          _context.next = 23;
                          return readFile(_path2.default.join(reportDir, _constants.ALL_LOG));

                        case 23:
                          all = _context.sent;

                          monitor.emit('complete', {
                            name: name,
                            id: id,
                            exitCode: status.exitCode,
                            startTime: status.startTime,
                            endTime: status.endTime,
                            stdout: stdout[0],
                            stderr: stderr[0],
                            all: all[0]
                          });
                          return _context.abrupt('break', 26);

                        case 26:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x, _x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
              monitor.close = function () {
                return watcher.close();
              };
            }));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createMonitor() {
    return _ref.apply(this, arguments);
  };
}();

var _constants = require('../constants');

var _mkdirp2 = require('mkdirp');

var _mkdirp3 = _interopRequireDefault(_mkdirp2);

var _rimraf2 = require('rimraf');

var _rimraf3 = _interopRequireDefault(_rimraf2);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisify = require('../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mkdirp = (0, _promisify2.default)(_mkdirp3.default);
var rimraf = (0, _promisify2.default)(_rimraf3.default);
var readFile = (0, _promisify2.default)(_fs.readFile);

var workingDirRegExp = _constants.WORKING_DIR.replace('.', '\\.');
var statusFileRegExp = _constants.STATUS_FILE.replace('.', '\\.');
var statusPathRegExp = new RegExp(workingDirRegExp + '/(.*)/(.*)/' + statusFileRegExp);