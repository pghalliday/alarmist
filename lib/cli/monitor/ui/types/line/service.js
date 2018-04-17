'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = createService;

var _service = require('../common/service');

var _service2 = _interopRequireDefault(_service);

var _jsonStream = require('../common/utils/json-stream');

var _jsonStream2 = _interopRequireDefault(_jsonStream);

var _reducer = require('./reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var type = 'line';

var actions = [_reducer.lineColors, _reducer.lineAdvance, _reducer.lineValue];

var LineService = function (_Service) {
  _inherits(LineService, _Service);

  function LineService(store) {
    _classCallCheck(this, LineService);

    var _this = _possibleConstructorReturn(this, (LineService.__proto__ || Object.getPrototypeOf(LineService)).call(this, store));

    _this.jsonStream = new _jsonStream2.default({
      store: store,
      type: type,
      actions: actions
    });
    return _this;
  }

  _createClass(LineService, [{
    key: 'start',
    value: function start(status) {
      _get(LineService.prototype.__proto__ || Object.getPrototypeOf(LineService.prototype), 'start', this).call(this, status);
      this.store.dispatch((0, _reducer.lineStart)(status));
    }
  }, {
    key: 'log',
    value: function log(status) {
      this.jsonStream.write(status);
    }
  }, {
    key: 'end',
    value: function end(status) {
      this.store.dispatch((0, _reducer.lineEnd)(status));
    }
  }]);

  return LineService;
}(_service2.default);

function createService(store) {
  return new LineService(store);
}