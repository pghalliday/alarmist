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

var _monitor = require('./monitor');

var _jobs = require('./jobs');

var _constants = require('../../../constants');

var _actions = require('../redux/actions');

var _constants2 = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createView(store) {
  var screen = _blessed2.default.screen({
    smartCSR: true,
    log: _path2.default.join(_constants.WORKING_DIR, _constants.UI_LOG)
  });
  screen.log('created');
  screen.title = 'alarmist';
  screen.key(['escape', 'q', 'C-c'], function () {
    return process.exit(0);
  });
  screen.key(['enter', 'o'], function () {
    return store.dispatch((0, _actions.toggleExpanded)());
  });
  var container = _blessed2.default.box(_constants2.CONTAINER_PROPERTIES);
  screen.append(container);
  container.key(['up', 'k'], function () {
    return store.dispatch((0, _actions.up)());
  });
  container.key(['down', 'j'], function () {
    return store.dispatch((0, _actions.down)());
  });
  var layout = (0, _layout.createLayout)(screen.program, container);
  var monitor = (0, _monitor.createMonitor)(layout);
  var jobs = (0, _jobs.createJobs)(layout);
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