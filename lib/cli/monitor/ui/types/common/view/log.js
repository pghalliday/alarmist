'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _copyPaste = require('copy-paste');

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Log = function (_Entry) {
  _inherits(Log, _Entry);

  function Log() {
    _classCallCheck(this, Log);

    var _this = _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this));

    _this.scrollOnExpand = true;
    _this.expanded = false;
    _this.log = _blessed2.default.box(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
    _this.log.key(['y'], function () {
      return (0, _copyPaste.copy)(_this.log.getText());
    });
    _this.log.key(['S-y'], function () {
      return (0, _copyPaste.copy)(_this.log.getContent());
    });
    _this.log.on('mouse', function (event) {
      // istanbul ignore else
      if (event.action === 'mousedown') {
        // istanbul ignore else
        if (event.shift) {
          if (event.button === 'left') {
            (0, _copyPaste.copy)(_this.log.getText());
          }
          if (event.button === 'right') {
            (0, _copyPaste.copy)(_this.log.getContent());
          }
        }
      }
    });
    _this.log.hide();
    _this.clear();
    return _this;
  }

  _createClass(Log, [{
    key: 'setParent',
    value: function setParent(container) {
      _get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'setParent', this).call(this, container);
      container.append(this.log);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.log.setContent('');
    }
  }, {
    key: 'update',
    value: function update(state) {
      _get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'update', this).call(this, state);
      var logData = state.selectors.log(state);
      if (this.logData !== logData) {
        this.logData = logData;
        this._setLog(logData);
      }
    }
    // istanbul ignore next

  }, {
    key: '_setLog',
    value: function _setLog(data) {
      var scroll = false;
      var scrolling = false;
      var height = this.log.height;
      if (this.expanded) {
        var beforeLineCount = this.log.getLines().length;
        if (beforeLineCount > height) {
          scrolling = true;
          scroll = this.log.getScrollPerc() === 100;
        }
      }
      this.log.setContent(data.toString());
      if (this.expanded) {
        if (!scroll) {
          var afterLineCount = this.log.getLines().length;
          if (!scrolling) {
            scroll = afterLineCount > height;
          }
        }
        if (scroll) {
          this.log.setScrollPerc(100);
        }
      }
    }
  }, {
    key: 'layout',
    value: function layout(rect) {
      if (_get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'layout', this).call(this, rect)) {
        this.log.height = rect.height - _constants.HEADER_HEIGHT;
        this.log.top = rect.top + _constants.HEADER_HEIGHT;
        this.log.width = rect.width - _constants.LOG_INDENT;
        this.log.left = rect.left + _constants.LOG_INDENT;
      }
    }
    // istanbul ignore next

  }, {
    key: 'collapse',
    value: function collapse() {
      _get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'collapse', this).call(this);
      if (this.expanded) {
        var height = this.log.height;
        var lineCount = this.log.getLines().length;
        if (lineCount <= height) {
          this.scrollOnExpand = true;
        } else {
          this.scrollOnExpand = this.log.getScrollPerc() === 100;
        }
        this.expanded = false;
        this.log.hide();
      }
    }
    // istanbul ignore next

  }, {
    key: 'expand',
    value: function expand() {
      _get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'expand', this).call(this);
      if (!this.expanded) {
        this.log.show();
        this.expanded = true;
        if (this.scrollOnExpand) {
          var height = this.log.height;
          var lineCount = this.log.getLines().length;
          if (lineCount > height) {
            this.log.setScrollPerc(100);
          }
        }
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      _get(Log.prototype.__proto__ || Object.getPrototypeOf(Log.prototype), 'focus', this).call(this);
      this.log.focus();
    }
  }]);

  return Log;
}(_entry2.default);

exports.default = Log;