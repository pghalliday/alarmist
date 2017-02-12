'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = undefined;

var exec = exports.exec = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var group = _ref.group,
        name = _ref.name,
        command = _ref.command;
    var job;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Job.createJob({ group: group, name: name });

          case 2:
            job = _context2.sent;
            _context2.next = 5;
            return new Promise(function (resolve) {
              var proc = (0, _child_process.exec)(command).on('exit', function () {
                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(exitCode) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return job.complete({ exitCode: exitCode });

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
              proc.stdout.pipe(job.stdout);
              proc.stderr.pipe(job.stderr);
            });

          case 5:
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

var _child_process = require('child_process');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }