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
  var jobs = {};
  var monitor = _blessed2.default.text({
    left: 2,
    content: ' monitor: ok',
    width: '100%',
    height: 1,
    style: {
      fg: 'black',
      bg: 'green'
    }
  });
  layout.append(monitor);
  function updateMonitor(state) {
    if (state.exitCode) {
      monitor.content = ' monitor: exited: ' + state.exitCode;
      monitor.style.bg = 'red';
    }
  }
  function updateJobs(state) {
    // eslint-disable-next-line max-len
    var jobContent = function jobContent(status) {
      return ' ' + status.name + ': ' + status.id + ': ' + (_lodash2.default.isUndefined(status.exitCode) ? 'pending' : status.exitCode);
    };
    // eslint-disable-next-line max-len
    var jobBg = function jobBg(status) {
      return _lodash2.default.isUndefined(status.exitCode) ? 'yellow' : status.exitCode === 0 ? 'green' : 'red';
    };
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var status = _step.value;

        if (jobs[status.name]) {
          var lastStatus = jobs[status.name].status;
          if (lastStatus !== status) {
            var element = jobs[status.name].element;
            element.content = jobContent(status);
            element.style.bg = jobBg(status);
          }
        } else {
          var _element = _blessed2.default.text({
            left: 2,
            content: jobContent(status),
            width: '100%',
            height: 1,
            style: {
              fg: 'black',
              bg: jobBg(status)
            }
          });
          jobs[status.name] = {
            element: _element,
            status: status
          };
          layout.append(_element);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  var update = function update() {
    var state = store.getState();
    updateMonitor(state.monitor);
    updateJobs(state.jobs);
    layout.apply();
    screen.render();
  };
  store.subscribe(update);
  update();
}

exports.createView = createView;