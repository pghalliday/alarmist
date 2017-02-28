'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogSocket = exports.getControlSocket = undefined;

// istanbul ignore next
var getSocket = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(server, file) {
    var namedPipe, _namedPipe;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(process.platform === 'win32')) {
              _context.next = 14;
              break;
            }

            if (!server) {
              _context.next = 8;
              break;
            }

            namedPipe = '\\\\.\\pipe\\' + (0, _uuid.v1)();
            _context.next = 5;
            return pwriteFile(file, namedPipe);

          case 5:
            return _context.abrupt('return', namedPipe);

          case 8:
            _context.next = 10;
            return preadFile(file);

          case 10:
            _namedPipe = _context.sent;
            return _context.abrupt('return', _namedPipe.toString());

          case 12:
            _context.next = 15;
            break;

          case 14:
            return _context.abrupt('return', file);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getSocket(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getControlSocket = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(server) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getSocket(server, controlSocket);

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getControlSocket(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getLogSocket = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(server) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getSocket(server, logSocket);

          case 2:
            return _context3.abrupt('return', _context3.sent);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getLogSocket(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _promisify = require('../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _fs = require('fs');

var _uuid = require('uuid');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var preadFile = (0, _promisify2.default)(_fs.readFile);
var pwriteFile = (0, _promisify2.default)(_fs.writeFile);
var controlSocket = _path2.default.join(_constants.WORKING_DIR, _constants.CONTROL_SOCKET);
var logSocket = _path2.default.join(_constants.WORKING_DIR, _constants.LOG_SOCKET);exports.getControlSocket = getControlSocket;
exports.getLogSocket = getLogSocket;