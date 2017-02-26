'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
  function Entry() {
    _classCallCheck(this, Entry);

    this.header = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.HEADER_PROPERTIES));
    this.log = _blessed2.default.box(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
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
      this.header.content = content;
      this.header.style.bg = color;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.log.content = '';
    }
  }, {
    key: '_setLog',
    value: function _setLog(data) {
      this.log.content = data.toString();
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
  }, {
    key: 'collapse',
    value: function collapse() {
      this.log.hide();
    }
  }, {
    key: 'expand',
    value: function expand() {
      this.log.show();
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