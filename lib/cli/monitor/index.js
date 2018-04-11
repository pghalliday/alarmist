'use strict';

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _options = require('./options');

var _constants = require('../../constants');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _promisify = require('../../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pmkdirp = (0, _promisify2.default)(_mkdirp2.default);

module.exports = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(argv) {
    var opts, screen, monitor;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = (0, _options.parse)(argv);
            // istanbul ignore next

            if (opts.version) {
              console.log(require('../../../package.json').version);
              process.exit(0);
            }
            // istanbul ignore next
            if (opts.help) {
              process.stdout.write((0, _options.help)());
              process.exit(0);
            }
            // istanbul ignore next
            if (opts.error) {
              console.log('ERROR: ' + opts.error);
              process.stdout.write((0, _options.help)());
              process.exit(1);
            }
            _context.next = 6;
            return pmkdirp(opts.workingDir);

          case 6:
            screen = _blessed2.default.screen({
              smartCSR: true,
              log: _path2.default.join(opts.workingDir, _constants.CLI_LOG),
              debug: opts.debug
            });

            _logger2.default.log = screen.log.bind(screen);
            _logger2.default.debug = screen.debug.bind(screen);
            _logger2.default.log('created');
            _context.prev = 10;
            _context.next = 13;
            return _2.default.createMonitor(opts);

          case 13:
            monitor = _context.sent;
            _context.next = 16;
            return _ui2.default.createUi(Object.assign({}, opts, {
              screen: screen,
              monitor: monitor
            }));

          case 16:
            monitor.start();
            _2.default.execMonitor(Object.assign({}, opts, {
              monitor: monitor
            }));
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context['catch'](10);

            // istanbul ignore next
            console.error(_context.t0.stack);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 20]]);
  }));

  function cli(_x) {
    return _ref.apply(this, arguments);
  }

  return cli;
}();