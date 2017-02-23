'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLayout = createLayout;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLayout(screen) {
  var lastState = void 0;
  var elements = {};
  var selectedIndicator = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.SELECTED_INDICATOR_PROPERTIES));
  screen.append(selectedIndicator);
  screen.log('appended selected indicator');
  return {
    append: function append(label, header, log) {
      elements[label] = {
        header: header,
        log: log
      };
      screen.append(header);
      screen.append(log);
      screen.log('appended ' + label);
    },
    apply: function apply(state) {
      if (state !== lastState) {
        lastState = state;
        var lines = state.lines;
        var selected = lines[state.selected];
        var totalHeaderHeight = _lodash2.default.reduce(elements, function (total, subElements) {
          return total + subElements.header.height;
        }, 0);
        var top = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var label = _step.value;

            var subElements = elements[label];
            var header = subElements.header;
            var log = subElements.log;
            log.height = 0;
            if (label === selected) {
              selectedIndicator.top = top;
              screen.log('set selected indicator top to ' + top);
              if (state.expanded) {
                selectedIndicator.content = _constants.DOWN_POINTER;
                log.height = screen.height - totalHeaderHeight;
                log.setScrollPerc(100);
                log.focus();
              } else {
                selectedIndicator.content = _constants.RIGHT_POINTER;
                header.focus();
              }
            }
            header.top = top;
            top += header.height;
            log.top = top;
            top += log.height;
            screen.log('set ' + label + ' top to ' + top);
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
    }
  };
}