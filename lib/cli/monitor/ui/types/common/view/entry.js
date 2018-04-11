'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entry = function (_EventEmitter) {
  _inherits(Entry, _EventEmitter);

  function Entry() {
    _classCallCheck(this, Entry);

    var _this = _possibleConstructorReturn(this, (Entry.__proto__ || Object.getPrototypeOf(Entry)).call(this));

    var topSelector = function topSelector(rect) {
      return rect.top;
    };
    var leftSelector = function leftSelector(rect) {
      return rect.left;
    };
    var widthSelector = function widthSelector(rect) {
      return rect.width;
    };
    var heightSelector = function heightSelector(rect) {
      return rect.height;
    };
    _this._layoutSelector = (0, _reselect.createSelector)(topSelector, leftSelector, widthSelector, heightSelector, function (top, left, width, height) {
      return { top: top, left: left, width: width, height: height };
    });
    _this._header = _blessed2.default.text({
      height: _constants.HEADER_HEIGHT,
      autoFocus: false
    });
    _this._header.on('click', function () {
      _this.emit('select');
    });
    return _this;
  }

  _createClass(Entry, [{
    key: 'setParent',
    value: function setParent(container) {
      container.append(this._header);
    }
  }, {
    key: 'update',
    value: function update(state) {
      var headerState = state.selectors.header(state);
      if (this._headerState !== headerState) {
        this._headerState = headerState;
        this._header.setContent(' ' + headerState.text);
        this._header.style.bg = headerState.bgcolor;
        this._header.style.fg = headerState.fgcolor;
      }
    }
  }, {
    key: 'layout',
    value: function layout(_rect) {
      var rect = this._layoutSelector(_rect);
      if (this._rect !== rect) {
        this._rect = rect;
        this._header.top = rect.top;
        this._header.left = rect.left;
        this._header.width = rect.width;
        return true;
      }
      return false;
    }
    // istanbul ignore next

  }, {
    key: 'collapse',
    value: function collapse() {}
    // istanbul ignore next

  }, {
    key: 'expand',
    value: function expand() {}
    // istanbul ignore next

  }, {
    key: 'focus',
    value: function focus() {}
  }]);

  return Entry;
}(_events2.default);

exports.default = Entry;