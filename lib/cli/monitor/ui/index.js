'use strict';

// istanbul ignore next
var createUi = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var screen = _ref.screen,
        monitor = _ref.monitor,
        configFile = _ref.configFile,
        workingDir = _ref.workingDir;
    var types, config, reducer, store, uiService;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            types = {
              task: _task2.default,
              service: _service3.default
            };
            _context2.next = 3;
            return (0, _loadConfigFile2.default)(configFile);

          case 3:
            config = _context2.sent;

            if (config.types) {
              Object.keys(config.types).forEach(function (type) {
                types[type] = require((0, _modulePath2.default)(config.types[type]));
              });
            }
            reducer = (0, _reducer.createReducer)(types, screen);
            store = (0, _redux.createStore)(reducer);
            uiService = (0, _service.createService)({ monitor: monitor, store: store, types: types });

            screen.key(['C-c'], _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return monitor.close();

                    case 2:
                      _context.next = 4;
                      return uiService.stop();

                    case 4:
                      process.exit(0);

                    case 5:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })));
            (0, _view.createView)({ screen: screen, store: store, workingDir: workingDir, types: types });

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createUi(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _redux = require('redux');

var _reducer = require('./redux/reducer');

var _service = require('./service');

var _view = require('./view');

var _task = require('./types/task');

var _task2 = _interopRequireDefault(_task);

var _service2 = require('./types/service');

var _service3 = _interopRequireDefault(_service2);

var _loadConfigFile = require('../../../utils/load-config-file');

var _loadConfigFile2 = _interopRequireDefault(_loadConfigFile);

var _modulePath = require('../../../utils/module-path');

var _modulePath2 = _interopRequireDefault(_modulePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

;

module.exports = {
  createUi: createUi
};