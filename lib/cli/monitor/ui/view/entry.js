'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _copyPaste = require('copy-paste');

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
  function Entry() {
    var _this = this;

    _classCallCheck(this, Entry);

    this.scrollOnExpand = true;
    this.expanded = false;
    this.header = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.HEADER_PROPERTIES));
    this.log = _blessed2.default.box(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
    this.log.key(['y'], function () {
      return (0, _copyPaste.copy)(_this.log.getText());
    });
    this.log.key(['S-y'], function () {
      return (0, _copyPaste.copy)(_this.log.getContent());
    });
    this.log.hide();
    this.clear();
  }

  _createClass(Entry, [{
    key: 'setParent',
    value: function setParent(container) {
      container.append(this.header);
      container.append(this.log);
    }
  }, {
    key: '_update',
    value: function _update() {}
  }, {
    key: 'update',
    value: function update(state) {
      if (this.state !== state) {
        this.state = state;
        this._update(state);
      }
    }
  }, {
    key: 'setHeader',
    value: function setHeader(content, color) {
      this.header.setContent(content);
      this.header.style.bg = color;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.log.setContent('');
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
    key: 'setLog',
    value: function setLog(data) {
      if (data !== this.logData) {
        this.logData = data;
        this._setLog(data);
      }
    }
  }, {
    key: 'getHeaderHeight',
    value: function getHeaderHeight() {
      return this.header.height;
    }
  }, {
    key: 'setLogHeight',
    value: function setLogHeight(height) {
      this.log.height = height;
    }
  }, {
    key: 'setTop',
    value: function setTop(top) {
      this.header.top = top;
      this.log.top = top + this.header.height;
    }
    // istanbul ignore next

  }, {
    key: 'collapse',
    value: function collapse() {
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
      this.log.focus();
    }
  }]);

  return Entry;
}();

exports.default = Entry;