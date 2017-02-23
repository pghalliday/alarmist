'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createView = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _layout = require('./layout');

var _monitor = require('./monitor');

var _jobs = require('./jobs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createView(store) {
  var screen = _blessed2.default.screen({
    smartCSR: true
  });
  screen.title = 'alarmist';
  screen.key(['escape', 'q', 'C-c'], function () {
    return process.exit(0);
  });
  var layout = (0, _layout.createLayout)(screen);
  var monitor = (0, _monitor.createMonitor)(layout);
  var jobs = (0, _jobs.createJobs)(layout);
  var update = function update() {
    var state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply();
    screen.render();
  };
  store.subscribe(update);
  update();
}

exports.createView = createView;