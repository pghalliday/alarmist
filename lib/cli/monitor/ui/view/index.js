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

var _layout2 = _interopRequireDefault(_layout);

var _entries = require('./entries');

var _entries2 = _interopRequireDefault(_entries);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _actions = require('../redux/actions');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createView(_ref) {
  var screen = _ref.screen,
      store = _ref.store,
      types = _ref.types;

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
  screen.key(['enter', 'o'], function () {
    return store.dispatch((0, _actions.toggleExpanded)());
  });
  var container = _blessed2.default.box(_constants.CONTAINER_PROPERTIES);
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
  var entries = new _entries2.default({ types: types, layout: layout });
  var update = _lodash2.default.throttle(function () {
    var state = store.getState();
    entries.update(state.entries);
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