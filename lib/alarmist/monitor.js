'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = undefined;

var createMonitor = exports.createMonitor = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref) {
    var _this = this;

    var reset = _ref.reset,
        name = _ref.name,
        workingDir = _ref.workingDir;
    var monitorLog, monitor, log, logStream, logStreamEnded, endLogStream, controlServer, controlListen, controlClose, controlSocket, logServer, logListen, logClose, logSocket, start;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            monitorLog = _path2.default.join(workingDir, _constants.MONITOR_LOG);
            monitor = new _events2.default();
            // istanbul ignore else

            if (!reset) {
              _context4.next = 5;
              break;
            }

            _context4.next = 5;
            return rimraf(workingDir);

          case 5:
            _context4.next = 7;
            return mkdirp(workingDir);

          case 7:
            // set up streams for logging the watcher process
            log = new _stream.PassThrough();
            logStream = (0, _fs.createWriteStream)(monitorLog);

            log.pipe(logStream);
            logStreamEnded = new Promise(function (resolve) {
              return logStream.on('close', resolve);
            });

            endLogStream = function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        logStream.end();
                        _context.next = 3;
                        return logStreamEnded;

                      case 3:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function endLogStream() {
                return _ref3.apply(this, arguments);
              };
            }();
            // set up the control socket for jobs


            controlServer = (0, _net.createServer)(function (client) {
              client.once('data', function (data) {
                var start = JSON.parse(data);
                monitor.emit('start', start);
                client.once('data', function (data) {
                  var end = JSON.parse(data);
                  monitor.emit('end', Object.assign({}, start, end));
                });
                client.write(_constants.READY_RESPONSE);
              });
            });
            controlListen = (0, _promisify2.default)(controlServer.listen.bind(controlServer));
            controlClose = (0, _promisify2.default)(controlServer.close.bind(controlServer));
            _context4.next = 17;
            return (0, _localSocket.getControlSocket)(workingDir, true);

          case 17:
            controlSocket = _context4.sent;
            _context4.next = 20;
            return controlListen(controlSocket);

          case 20:
            // set up the log socket for jobs
            logServer = (0, _net.createServer)(function (client) {
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
            logListen = (0, _promisify2.default)(logServer.listen.bind(logServer));
            logClose = (0, _promisify2.default)(logServer.close.bind(logServer));
            _context4.next = 25;
            return (0, _localSocket.getLogSocket)(workingDir, true);

          case 25:
            logSocket = _context4.sent;
            _context4.next = 28;
            return logListen(logSocket);

          case 28:
            log.on('data', function (data) {
              monitor.emit('log', {
                name: name,
                id: id,
                type: type,
                data: data
              });
            });
            // expose the monitor properties and methods
            monitor.log = log;
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
                      return endLogStream();

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
            start = void 0;

            monitor.start = function () {
              var startTime = Date.now();
              start = {
                name: name,
                id: id,
                type: type,
                startTime: startTime
              };
              monitor.emit('start', start);
            };
            monitor.end = function () {
              var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(error) {
                var endTime;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return endLogStream();

                      case 2:
                        endTime = Date.now();

                        monitor.emit('end', Object.assign({}, start, {
                          endTime: endTime,
                          error: error
                        }));

                      case 4:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x2) {
                return _ref5.apply(this, arguments);
              };
            }();
            return _context4.abrupt('return', monitor);

          case 35:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function createMonitor(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _constants = require('../constants');

var _localSocket = require('./local-socket');

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

var type = 'service';
var id = 1;