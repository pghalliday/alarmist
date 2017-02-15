'use strict';

var getId = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file) {
    var lockFile, id;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            lockFile = file + '.lock';
            _context.next = 3;
            return mkdirp((0, _path.dirname)(file));

          case 3:
            _context.next = 5;
            return lock(lockFile, {
              wait: 2000
            });

          case 5:
            id = 0;
            _context.prev = 6;
            _context.t0 = parseInt;
            _context.next = 10;
            return readFile(file);

          case 10:
            _context.t1 = _context.sent;
            id = (0, _context.t0)(_context.t1);
            _context.next = 16;
            break;

          case 14:
            _context.prev = 14;
            _context.t2 = _context['catch'](6);

          case 16:
            id++;
            _context.next = 19;
            return writeFile(file, id + '');

          case 19:
            _context.next = 21;
            return unlock(lockFile);

          case 21:
            return _context.abrupt('return', id);

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 14]]);
  }));

  return function getId(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _lockfile = require('lockfile');

var _fs = require('fs');

var _promisify = require('./promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _path = require('path');

var _mkdirp2 = require('mkdirp');

var _mkdirp3 = _interopRequireDefault(_mkdirp2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var lock = (0, _promisify2.default)(_lockfile.lock);
var unlock = (0, _promisify2.default)(_lockfile.unlock);
var readFile = (0, _promisify2.default)(_fs.readFile);
var writeFile = (0, _promisify2.default)(_fs.writeFile);
var mkdirp = (0, _promisify2.default)(_mkdirp3.default);

module.exports = {
  getId: getId
};