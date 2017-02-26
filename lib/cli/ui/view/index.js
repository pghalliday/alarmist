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

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('../../../constants');

var _actions = require('../redux/actions');

var _constants2 = require('../constants');

var _constants3 = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createView(service, store) {
  var screen = _blessed2.default.screen({
    smartCSR: true,
    log: _path2.default.join(_constants.WORKING_DIR, _constants.BLESSED_LOG)
  });
  _logger2.default.log = screen.log.bind(screen);
  _logger2.default.debug = screen.debug.bind(screen);
  _logger2.default.log('created');
  screen.title = 'alarmist';
  screen.key(['C-c'], function () {
    return process.exit(0);
  });
  screen.key(['enter', 'o'], function () {
    return store.dispatch((0, _actions.toggleExpanded)());
  });
  var container = _blessed2.default.box(_constants3.CONTAINER_PROPERTIES);
  screen.append(container);
  container.key(['up', 'k'], function () {
    return store.dispatch((0, _actions.up)());
  });
  container.key(['down', 'j'], function () {
    return store.dispatch((0, _actions.down)());
  });
  var layout = new _layout2.default(container);
  var monitor = new _monitor2.default();
  layout.append(_constants2.MONITOR_LABEL, monitor);
  var jobs = new _jobs2.default(_job2.default, layout);
  var update = function update() {
    var state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply(state.layout);
    screen.render();
  };
  store.subscribe(update);
  update();
}

exports.createView = createView;