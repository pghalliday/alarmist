'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cleanup = function () {
  function Cleanup() {
    var _this = this;

    _classCallCheck(this, Cleanup);

    this.callbacks = [];
    // istanbul ignore next
    process.on('uncaughtException', function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(error) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.end();

              case 2:
                console.error(error.stack);
                process.exit(1);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  // istanbul ignore next


  _createClass(Cleanup, [{
    key: 'end',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.callbacks.length) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return this.callbacks.pop()();

              case 3:
                _context2.next = 0;
                break;

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function end() {
        return _ref2.apply(this, arguments);
      }

      return end;
    }()
  }, {
    key: 'register',
    value: function register(callback) {
      this.callbacks.push(callback);
    }
  }]);

  return Cleanup;
}();

var cleanup = new Cleanup();
exports.default = cleanup;