'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layout = function () {
  function Layout(container) {
    _classCallCheck(this, Layout);

    this.container = container;
    this.entries = {};
    _logger2.default.log('appending selected indicator');
    this.selectedIndicator = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.SELECTED_INDICATOR_PROPERTIES));
    this.container.append(this.selectedIndicator);
  }

  _createClass(Layout, [{
    key: 'append',
    value: function append(label, entry) {
      _logger2.default.log('appending ' + label);
      this.entries[label] = entry;
      entry.setParent(this.container);
    }
  }, {
    key: 'apply',
    value: function apply(state) {
      if (state !== this.lastState) {
        this.lastState = state;
        var lines = state.lines;
        var selected = lines[state.selected];
        var totalHeaderHeight = _lodash2.default.reduce(this.entries, function (total, entry) {
          return total + entry.getHeaderHeight();
        }, 0);
        var top = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var label = _step.value;

            var entry = this.entries[label];
            var realLogHeight = this.container.height - totalHeaderHeight;
            entry.setLogHeight(realLogHeight);
            entry.collapse();
            var logHeight = 0;
            if (label === selected) {
              _logger2.default.log('setting selected indicator top to ' + top);
              this.selectedIndicator.top = top;
              if (state.expanded) {
                this.selectedIndicator.content = _constants.DOWN_POINTER;
                entry.expand();
                entry.focus();
                logHeight = realLogHeight;
              } else {
                this.selectedIndicator.content = _constants.RIGHT_POINTER;
                this.container.focus();
              }
            }
            _logger2.default.log('setting ' + label + ' top to ' + top);
            entry.setTop(top);
            top += entry.getHeaderHeight();
            top += logHeight;
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
  }]);

  return Layout;
}();

exports.default = Layout;