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

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _STATUS_COLORS = ['green', 'yellow', 'red'];

function _jobContent(status) {
  var message = 'ok';
  return ' ' + status.name + ': ' + message;
}

function _jobBg(_status) {
  return 'green';
}

var Table = function (_Entry) {
  _inherits(Table, _Entry);

  function Table() {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this));

    _this.expanded = false;
    _this.table = _blessed2.default.table(_lodash2.default.cloneDeep(_constants.TABLE_PROPERTIES));
    _this.table.hide();
    _this.clear();
    return _this;
  }

  _createClass(Table, [{
    key: '_setContentParent',
    value: function _setContentParent(container) {
      container.append(this.table);
    }
  }, {
    key: '_update',
    value: function _update(_status) {}
  }, {
    key: 'clear',
    value: function clear() {
      this.table.setData([]);
    }
  }, {
    key: 'setContentHeight',
    value: function setContentHeight(height) {
      this.table.height = height;
    }
  }, {
    key: '_setContentTop',
    value: function _setContentTop(top) {
      this.table.top = top;
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      if (this.expanded) {
        this.expanded = false;
        this.table.hide();
      }
    }
  }, {
    key: 'expand',
    value: function expand() {
      if (!this.expanded) {
        this.table.show();
        this.expanded = true;
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.table.focus();
    }
  }]);

  return Table;
}(_entry2.default);

exports.default = Table;