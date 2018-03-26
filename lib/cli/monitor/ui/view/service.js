'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function jobContent(status) {
  var name = status.name;
  var error = _lodash2.default.isUndefined(status.error) ? 'ended' : status.error;
  var message = _lodash2.default.isUndefined(status.endTime) ? 'ok' : error;
  return ' ' + name + ': ' + message;
}

function jobBg(status) {
  return _lodash2.default.isUndefined(status.endTime) ? 'green' : 'red';
}

var Service = function (_Log) {
  _inherits(Service, _Log);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).call(this));
  }

  _createClass(Service, [{
    key: '_update',
    value: function _update(status) {
      this.setHeader(jobContent(status), jobBg(status));
      this.setLog(status.log);
    }
  }]);

  return Service;
}(_log2.default);

exports.default = Service;