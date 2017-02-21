'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = undefined;

var createMonitor = exports.createMonitor = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
    var _this = this;

    var monitor, emitJob, watcher, stdout, stderr, stdoutStream, stderrStream, allStream, streamEndPromises, endStreams;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            monitor = new _events2.default();
            _context5.next = 3;
            return rimraf(_constants.WORKING_DIR);

          case 3:
            _context5.next = 5;
            return mkdirp(_constants.WORKING_DIR);

          case 5:
            emitJob = function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
                var match, name, id, statusJson, status, event;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        match = statusPathRegExp.exec(filePath);
                        name = match[1];
                        id = match[2];
                        _context.next = 5;
                        return readFile(filePath);

                      case 5:
                        statusJson = _context.sent;
                        status = JSON.parse(statusJson[0]);
                        event = Object.assign({}, status, {
                          name: name,
                          id: id
                        });

                        monitor.emit('update', event);

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function emitJob(_x) {
                return _ref2.apply(this, arguments);
              };
            }();

            watcher = _chokidar2.default.watch(_constants.WORKING_DIR + '/*/*/' + _constants.STATUS_FILE).on('add', emitJob).on('change', emitJob);
            stdout = new _stream.PassThrough();
            stderr = new _stream.PassThrough();
            stdoutStream = (0, _fs.createWriteStream)(_path2.default.join(_constants.WORKING_DIR, _constants.STDOUT_LOG));
            stderrStream = (0, _fs.createWriteStream)(_path2.default.join(_constants.WORKING_DIR, _constants.STDERR_LOG));
            allStream = (0, _fs.createWriteStream)(_path2.default.join(_constants.WORKING_DIR, _constants.ALL_LOG));

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
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        stdout.end();
                        stderr.end();
                        _context2.next = 4;
                        return Promise.all(streamEndPromises);

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function endStreams() {
                return _ref3.apply(this, arguments);
              };
            }();

            monitor.close = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (_lodash2.default.isUndefined(monitor.cleanup)) {
                        _context3.next = 3;
                        break;
                      }

                      _context3.next = 3;
                      return monitor.cleanup();

                    case 3:
                      _context3.next = 5;
                      return endStreams();

                    case 5:
                      watcher.close();

                    case 6:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this);
            }));
            monitor.stdout = stdout;
            monitor.stderr = stderr;
            monitor.exit = function () {
              var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(code) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return endStreams();

                      case 2:
                        monitor.emit('exit', code);

                      case 3:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this);
              }));

              return function (_x2) {
                return _ref5.apply(this, arguments);
              };
            }();
            _context5.next = 24;
            return new Promise(function (resolve) {
              return watcher.on('ready', resolve);
            });

          case 24:
            return _context5.abrupt('return', monitor);

          case 25:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
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

var _stream = require('stream');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mkdirp = (0, _promisify2.default)(_mkdirp3.default);
var rimraf = (0, _promisify2.default)(_rimraf3.default);
var readFile = (0, _promisify2.default)(_fs.readFile);

var workingDirRegExp = _constants.WORKING_DIR.replace('.', '\\.');
var statusFileRegExp = _constants.STATUS_FILE.replace('.', '\\.');
var statusPathRegExp = new RegExp(workingDirRegExp + '/(.*)/(.*)/' + statusFileRegExp);