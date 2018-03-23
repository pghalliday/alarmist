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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entry = function (_EventEmitter) {
  _inherits(Entry, _EventEmitter);

  function Entry() {
    _classCallCheck(this, Entry);

    var _this = _possibleConstructorReturn(this, (Entry.__proto__ || Object.getPrototypeOf(Entry)).call(this));

    _this.header = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.HEADER_PROPERTIES));
    _this.header.on('click', function () {
      _this.emit('select');
    });
    return _this;
  }

  _createClass(Entry, [{
    key: '_setContentParent',
    value: function _setContentParent(_container) {}
  }, {
    key: 'setParent',
    value: function setParent(container) {
      container.append(this.header);
      this._setContentParent(container);
    }
  }, {
    key: '_update',
    value: function _update(_status) {}
  }, {
    key: 'update',
    value: function update(status) {
      if (this.status !== status) {
        this.status = status;
        this._update(status);
      }
    }
  }, {
    key: 'setHeader',
    value: function setHeader(content, color) {
      this.header.setContent(content);
      this.header.style.bg = color;
    }
    // istanbul ignore next

  }, {
    key: 'getHeaderHeight',
    value: function getHeaderHeight() {
      return this.header.height;
    }
  }, {
    key: 'setContentHeight',
    value: function setContentHeight(_height) {}
  }, {
    key: '_setContentTop',
    value: function _setContentTop(_top) {}
  }, {
    key: 'setTop',
    value: function setTop(top) {
      this.header.top = top;
      this._setContentTop(top + this.header.height);
    }
    // istanbul ignore next

  }, {
    key: 'collapse',
    value: function collapse() {}
    // istanbul ignore next

  }, {
    key: 'expand',
    value: function expand() {}
  }, {
    key: 'focus',
    value: function focus() {}
  }]);

  return Entry;
}(_events2.default);

exports.default = Entry;