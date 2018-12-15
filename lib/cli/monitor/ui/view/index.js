"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createView = createView;

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _blessed = _interopRequireDefault(require("blessed"));

var _layout = _interopRequireDefault(require("./layout"));

var _monitor = _interopRequireDefault(require("./monitor"));

var _jobs = _interopRequireDefault(require("./jobs"));

var _job = _interopRequireDefault(require("./job"));

var _metric = _interopRequireDefault(require("./metric"));

var _logger = _interopRequireDefault(require("./logger"));

var _constants = require("../../../../constants");

var _actions = require("../redux/actions");

var _constants2 = require("../constants");

var _constants3 = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createView(service, store, workingDir, debug) {
  const screen = _blessed.default.screen({
    smartCSR: true,
    log: _path.default.join(workingDir, _constants.UI_LOG),
    debug
  });

  _logger.default.log = screen.log.bind(screen);
  _logger.default.debug = screen.debug.bind(screen);

  _logger.default.log('created');

  screen.title = 'alarmist';
  screen.on('keypress', (...args) => {
    _logger.default.debug(args);
  });
  screen.on('mouse', (...args) => {
    _logger.default.debug(args);
  });
  screen.key(['C-c'], async () => {
    await service.stop();
    process.exit(0);
  });
  screen.key(['enter', 'o'], () => store.dispatch((0, _actions.toggleExpanded)()));

  const container = _blessed.default.box(_constants3.CONTAINER_PROPERTIES);

  screen.key(['C-up', 'C-k'], () => {
    container.focus();
    store.dispatch((0, _actions.moveUp)());
  });
  screen.key(['C-down', 'C-j', 'linefeed'], () => {
    container.focus();
    store.dispatch((0, _actions.moveDown)());
  });
  screen.key(['S-up', 'S-k'], () => {
    container.focus();
    store.dispatch((0, _actions.up)());
  });
  screen.key(['S-down', 'S-j'], () => {
    container.focus();
    store.dispatch((0, _actions.down)());
  });
  screen.append(container);
  container.key(['up', 'k'], () => store.dispatch((0, _actions.up)()));
  container.key(['down', 'j'], () => store.dispatch((0, _actions.down)()));
  const layout = new _layout.default(container);
  layout.on('select', label => {
    store.dispatch((0, _actions.select)(label));
  });
  layout.on('toggleExpanded', () => {
    store.dispatch((0, _actions.toggleExpanded)());
  });
  const monitor = new _monitor.default();
  layout.append(_constants2.MONITOR_LABEL, monitor);
  const jobs = new _jobs.default(_job.default, _metric.default, layout);

  const update = _lodash.default.throttle(() => {
    const state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply(state.layout);
    screen.render();
  });

  screen.on('resize', () => {
    _logger.default.log('resize');

    _logger.default.debug('width: ' + screen.width);

    _logger.default.debug('height: ' + screen.height);

    store.dispatch((0, _actions.resize)({
      width: screen.width,
      height: screen.height
    }));
  });
  store.subscribe(update);
  update();
}