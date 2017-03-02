'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = undefined;

var exec = exports.exec = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var name = _ref.name,
        command = _ref.command,
        args = _ref.args;
    var job;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Job.createJob(name);

          case 2:
            job = _context2.sent;
            _context2.next = 5;
            return new Promise(function (resolve) {
              var proc = (0, _crossSpawn2.default)(command, args).on('exit', function () {
                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(exitCode) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return job.exit(exitCode);

                        case 2:
                          resolve();

                        case 3:
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
              proc.stdout.pipe(job.log);
              proc.stderr.pipe(job.log);
            });

          case 5:
            return _context2.abrupt('return', _context2.sent);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function exec(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _job = require('./job');

var Job = _interopRequireWildcard(_job);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }