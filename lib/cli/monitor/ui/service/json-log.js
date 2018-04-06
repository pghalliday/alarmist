'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

var _actions = require('../redux/actions');

var _simpleJsonDocStream = require('simple-json-doc-stream');

var _simpleJsonDocStream2 = _interopRequireDefault(_simpleJsonDocStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Expects log entries to come in single line JSON documents
 * with the following structure
 *
 *   {
 *     type: <DATA_TYPE>,
 *     data: <LOG_DATA>
 *   }
 */
var JSONLog = function (_Run) {
  _inherits(JSONLog, _Run);

  function JSONLog(type, params) {
    _classCallCheck(this, JSONLog);

    var _this = _possibleConstructorReturn(this, (JSONLog.__proto__ || Object.getPrototypeOf(JSONLog)).call(this, params));

    var store = params.store,
        name = params.status;

    _this.stream = new _simpleJsonDocStream2.default();
    _this.stream.on('error', function (_error) {
      // TODO: log error in debug mode
    });
    _this.stream.on('parsed', function (parsed) {
      if (parsed.type === type) {
        var data = parsed.data;
        store.dispatch((0, _actions.runLog)({
          name: name,
          type: type,
          data: data
        }));
      } else {
        // TODO: log error in debug mode
      }
    });
    return _this;
  }

  _createClass(JSONLog, [{
    key: 'log',
    value: function log(logData) {
      this.stream.write(logData.data);
    }
  }]);

  return JSONLog;
}(_run2.default);

exports.default = JSONLog;