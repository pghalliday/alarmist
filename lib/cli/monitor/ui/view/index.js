'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createView = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _jobs = require('./jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _job = require('./job');

var _job2 = _interopRequireDefault(_job);

var _metric = require('./metric');

var _metric2 = _interopRequireDefault(_metric);

var _table = require('./table');

var _table2 = _interopRequireDefault(_table);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('../../../../constants');

var _actions = require('../redux/actions');

var _constants2 = require('../constants');

var _constants3 = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// istanbul ignore next
function createView(service, store, workingDir, debug) {
  var _this = this;

  var screen = _blessed2.default.screen({
    smartCSR: true,
    log: _path2.default.join(workingDir, _constants.UI_LOG),
    debug: debug
  });
  _logger2.default.log = screen.log.bind(screen);
  _logger2.default.debug = screen.debug.bind(screen);
  _logger2.default.log('created');
  screen.title = 'alarmist';
  screen.on('keypress', function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _logger2.default.debug(args);
  });
  screen.on('mouse', function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _logger2.default.debug(args);
  });
  screen.key(['C-c'], _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return service.stop();

          case 2:
            process.exit(0);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  })));
  screen.key(['enter', 'o'], function () {
    return store.dispatch((0, _actions.toggleExpanded)());
  });
  var container = _blessed2.default.box(_constants3.CONTAINER_PROPERTIES);
  screen.key(['C-up', 'C-k'], function () {
    container.focus();
    store.dispatch((0, _actions.moveUp)());
  });
  screen.key(['C-down', 'C-j', 'linefeed'], function () {
    container.focus();
    store.dispatch((0, _actions.moveDown)());
  });
  screen.key(['S-up', 'S-k'], function () {
    container.focus();
    store.dispatch((0, _actions.up)());
  });
  screen.key(['S-down', 'S-j'], function () {
    container.focus();
    store.dispatch((0, _actions.down)());
  });
  screen.append(container);
  container.key(['up', 'k'], function () {
    return store.dispatch((0, _actions.up)());
  });
  container.key(['down', 'j'], function () {
    return store.dispatch((0, _actions.down)());
  });
  var layout = new _layout2.default(container);
  layout.on('select', function (label) {
    store.dispatch((0, _actions.select)(label));
  });
  layout.on('toggleExpanded', function () {
    store.dispatch((0, _actions.toggleExpanded)());
  });
  var monitor = new _monitor2.default();
  layout.append(_constants2.MONITOR_LABEL, monitor);
  var jobs = new _jobs2.default({ Job: _job2.default, Metric: _metric2.default, Table: _table2.default, Service: _service2.default, layout: layout });
  var update = _lodash2.default.throttle(function () {
    var state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply(state.layout);
    screen.render();
  });
  screen.on('resize', function () {
    _logger2.default.log('resize');
    _logger2.default.debug('width: ' + screen.width);
    _logger2.default.debug('height: ' + screen.height);
    store.dispatch((0, _actions.resize)({
      width: screen.width,
      height: screen.height
    }));
  });
  store.subscribe(update);
  update();
}

exports.createView = createView;