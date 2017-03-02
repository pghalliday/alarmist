'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJob = undefined;

var createJob = exports.createJob = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
    var _this = this;

    var jobDir, idFile, id, reportDir, statusFile, startTime, log, logStream, logStreamEnded, controlSocket, controlConnection, controlReady, controlEnded, logSocket, logConnection, logReady, logEnded;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // set up the file reporting
            jobDir = _path2.default.join(_constants.WORKING_DIR, _constants.JOBS_DIR, name);
            idFile = _path2.default.join(jobDir, _constants.ID_FILE);
            _context2.next = 4;
            return _id3.default.getId(idFile);

          case 4:
            id = _context2.sent;
            reportDir = _path2.default.join(jobDir, '' + id);
            statusFile = _path2.default.join(reportDir, _constants.STATUS_FILE);
            startTime = Date.now();
            _context2.next = 10;
            return mkdirp(reportDir);

          case 10:
            _context2.next = 12;
            return writeFile(statusFile, JSON.stringify({
              startTime: startTime
            }));

          case 12:
            log = new _stream.PassThrough();
            logStream = (0, _fs.createWriteStream)(_path2.default.join(reportDir, _constants.PROCESS_LOG));

            log.pipe(logStream);
            log.pipe(process.stdout);
            logStreamEnded = new Promise(function (resolve) {
              return logStream.on('close', resolve);
            });
            // start the control socket

            _context2.next = 19;
            return (0, _localSocket.getControlSocket)(false);

          case 19:
            controlSocket = _context2.sent;
            controlConnection = (0, _net.createConnection)(controlSocket);
            controlReady = new Promise(function (resolve) {
              return controlConnection.once('data', resolve);
            });
            controlEnded = new Promise(function (resolve) {
              return controlConnection.once('end', resolve);
            });
            _context2.next = 25;
            return new Promise(function (resolve) {
              return controlConnection.once('connect', resolve);
            });

          case 25:
            controlConnection.write(JSON.stringify({
              name: name,
              id: id,
              startTime: startTime
            }));
            _context2.next = 28;
            return controlReady;

          case 28:
            _context2.next = 30;
            return (0, _localSocket.getLogSocket)(false);

          case 30:
            logSocket = _context2.sent;
            logConnection = (0, _net.createConnection)(logSocket);
            logReady = new Promise(function (resolve) {
              return logConnection.once('data', resolve);
            });
            logEnded = new Promise(function (resolve) {
              return logConnection.once('end', resolve);
            });
            _context2.next = 36;
            return new Promise(function (resolve) {
              return logConnection.once('connect', resolve);
            });

          case 36:
            logConnection.write(JSON.stringify({
              name: name,
              id: id
            }));
            _context2.next = 39;
            return logReady;

          case 39:
            log.pipe(logConnection);
            // return the job
            return _context2.abrupt('return', {
              log: log,
              exit: function () {
                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(exitCode) {
                  var endTime;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          endTime = Date.now();

                          log.end();
                          _context.next = 4;
                          return logStreamEnded;

                        case 4:
                          _context.next = 6;
                          return writeFile(statusFile, JSON.stringify({
                            exitCode: exitCode,
                            startTime: startTime,
                            endTime: endTime
                          }));

                        case 6:
                          _context.next = 8;
                          return logEnded;

                        case 8:
                          controlConnection.end(JSON.stringify({
                            endTime: endTime,
                            exitCode: exitCode
                          }));
                          _context.next = 11;
                          return controlEnded;

                        case 11:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                function exit(_x2) {
                  return _ref2.apply(this, arguments);
                }

                return exit;
              }()
            });

          case 41:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createJob(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _constants = require('../constants');

var _localSocket = require('./local-socket');

var _net = require('net');

var _mkdirp2 = require('mkdirp');

var _mkdirp3 = _interopRequireDefault(_mkdirp2);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisify = require('../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _stream = require('stream');

var _id2 = require('../utils/id');

var _id3 = _interopRequireDefault(_id2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mkdirp = (0, _promisify2.default)(_mkdirp3.default);
var writeFile = (0, _promisify2.default)(_fs.writeFile);