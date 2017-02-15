'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJob = undefined;

var createJob = exports.createJob = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var name = _ref.name;
    var jobDir, idFile, id, reportDir, statusFile, startTime, stdout, stderr, stdoutStream, stderrStream, allStream, streamEndPromises;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jobDir = _path2.default.join(_constants.WORKING_DIR, name);
            idFile = _path2.default.join(jobDir, _constants.ID_FILE);
            _context2.next = 4;
            return _id3.default.getId(idFile);

          case 4:
            id = _context2.sent;
            reportDir = _path2.default.join(jobDir, id);
            statusFile = _path2.default.join(reportDir, _constants.STATUS_FILE);
            startTime = Date.now();
            _context2.next = 10;
            return mkdirp(reportDir);

          case 10:
            _context2.next = 12;
            return writeFile(statusFile, JSON.stringify({
              status: _constants.STATUS_PENDING,
              startTime: startTime
            }));

          case 12:
            stdout = new _stream.PassThrough();
            stderr = new _stream.PassThrough();
            stdoutStream = (0, _fs.createWriteStream)(_path2.default.join(reportDir, _constants.STDOUT_LOG));
            stderrStream = (0, _fs.createWriteStream)(_path2.default.join(reportDir, _constants.STDERR_LOG));
            allStream = (0, _fs.createWriteStream)(_path2.default.join(reportDir, _constants.ALL_LOG));

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
            return _context2.abrupt('return', {
              stdout: stdout,
              stderr: stderr,
              exit: function () {
                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(exitCode) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          stdout.end();
                          stderr.end();
                          _context.next = 4;
                          return Promise.all(streamEndPromises);

                        case 4:
                          _context.next = 6;
                          return writeFile(statusFile, JSON.stringify({
                            status: _constants.STATUS_COMPLETE,
                            exitCode: exitCode,
                            startTime: startTime,
                            endTime: Date.now()
                          }));

                        case 6:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                function exit(_x2) {
                  return _ref3.apply(this, arguments);
                }

                return exit;
              }()
            });

          case 23:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createJob(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _constants = require('../constants');

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