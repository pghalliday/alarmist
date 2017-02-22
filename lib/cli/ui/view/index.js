'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createView = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

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
  screen.append(monitor);
  var layout = [monitor];
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
          screen.append(_element);
          layout.push(_element);
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
  function updateLayout() {
    var topOffset = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = layout[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var element = _step2.value;

        element.top = topOffset;
        topOffset = topOffset + element.height;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
  store.subscribe(function () {
    var state = store.getState();
    updateMonitor(state.monitor);
    updateJobs(state.jobs);
    updateLayout();
    screen.render();
  });
  updateLayout();
  screen.render();
}

exports.createView = createView;