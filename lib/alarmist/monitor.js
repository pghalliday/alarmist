'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = undefined;

var createMonitor = exports.createMonitor = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var _this = this;

    var monitor, stdout, stderr, stdoutStream, stderrStream, allStream, streamEndPromises, endStreams, control, controlListen, controlClose, log, logListen, logClose;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            monitor = new _events2.default();
            _context4.next = 3;
            return rimraf(_constants.WORKING_DIR);

          case 3:
            _context4.next = 5;
            return mkdirp(_constants.WORKING_DIR);

          case 5:
            // set up streams for logging the watcher process
            stdout = new _stream.PassThrough();
            stderr = new _stream.PassThrough();
            stdoutStream = (0, _fs.createWriteStream)(stdoutLog);
            stderrStream = (0, _fs.createWriteStream)(stderrLog);
            allStream = (0, _fs.createWriteStream)(allLog);

            stdout.pipe(stdoutStream);
            stdout.pipe(allStream);
            stderr.pipe(stderrStream);
            stderr.pipe(allStream);
            streamEndPromises = [new Promise(function (resolve) {
              return stdoutStream.on('close', resolve);
            }), new Promise(function (resolve) {
              return stderrStream.on('close', resolve);
            }), new Promise(function (resolve) {
              return allStream.on('close', resolve);
            })];

            endStreams = function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        stdout.end();
                        stderr.end();
                        _context.next = 4;
                        return Promise.all(streamEndPromises);

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function endStreams() {
                return _ref2.apply(this, arguments);
              };
            }();
            // set up the control socket for jobs


            control = (0, _net.createServer)(function (client) {
              client.once('data', function (data) {
                var start = JSON.parse(data);
                monitor.emit('update', start);
                client.once('data', function (data) {
                  var end = JSON.parse(data);
                  monitor.emit('update', Object.assign({}, start, end));
                });
                client.write(_constants.READY_RESPONSE);
              });
            });
            controlListen = (0, _promisify2.default)(control.listen.bind(control));
            controlClose = (0, _promisify2.default)(control.close.bind(control));
            _context4.next = 21;
            return controlListen(controlSocket);

          case 21:
            // set up the log socket for jobs
            log = (0, _net.createServer)(function (client) {
              client.once('data', function (data) {
                var begin = JSON.parse(data);
                client.on('data', function (data) {
                  monitor.emit('log', Object.assign({}, begin, {
                    data: data
                  }));
                });
                client.write(_constants.READY_RESPONSE);
              });
            });
            logListen = (0, _promisify2.default)(log.listen.bind(log));
            logClose = (0, _promisify2.default)(log.close.bind(log));
            _context4.next = 26;
            return logListen(logSocket);

          case 26:
            // expose the monitor properties and methods
            monitor.close = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (_lodash2.default.isUndefined(monitor.cleanup)) {
                        _context2.next = 3;
                        break;
                      }

                      _context2.next = 3;
                      return monitor.cleanup();

                    case 3:
                      _context2.next = 5;
                      return endStreams();

                    case 5:
                      _context2.next = 7;
                      return controlClose();

                    case 7:
                      _context2.next = 9;
                      return logClose();

                    case 9:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this);
            }));
            monitor.stdout = stdout;
            monitor.stderr = stderr;
            monitor.exit = function () {
              var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(code) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return endStreams();

                      case 2:
                        monitor.emit('exit', code);

                      case 3:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x) {
                return _ref4.apply(this, arguments);
              };
            }();
            return _context4.abrupt('return', monitor);

          case 31:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function createMonitor() {
    return _ref.apply(this, arguments);
  };
}();

var _constants = require('../constants');

var _net = require('net');

var _mkdirp2 = require('mkdirp');

var _mkdirp3 = _interopRequireDefault(_mkdirp2);

var _rimraf2 = require('rimraf');

var _rimraf3 = _interopRequireDefault(_rimraf2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisify = require('../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _stream = require('stream');

var _fs = require('fs');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mkdirp = (0, _promisify2.default)(_mkdirp3.default);
var rimraf = (0, _promisify2.default)(_rimraf3.default);

var stdoutLog = _path2.default.join(_constants.WORKING_DIR, _constants.STDOUT_LOG);
var stderrLog = _path2.default.join(_constants.WORKING_DIR, _constants.STDERR_LOG);
var allLog = _path2.default.join(_constants.WORKING_DIR, _constants.ALL_LOG);
var controlSocket = _path2.default.join(_constants.WORKING_DIR, _constants.CONTROL_SOCKET);
var logSocket = _path2.default.join(_constants.WORKING_DIR, _constants.LOG_SOCKET);