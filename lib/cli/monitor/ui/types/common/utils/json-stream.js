'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simpleJsonDocStream = require('simple-json-doc-stream');

var _simpleJsonDocStream2 = _interopRequireDefault(_simpleJsonDocStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONStream = function () {
  function JSONStream(_ref) {
    var _this = this;

    var store = _ref.store,
        type = _ref.type,
        actions = _ref.actions;

    _classCallCheck(this, JSONStream);

    this.stream = new _simpleJsonDocStream2.default();
    actions = actions.reduce(function (actions, action) {
      return Object.assign(actions, _defineProperty({}, action, action));
    }, {});
    this.stream.on('parsed', function (data) {
      console.log(data);
      if (data.target === 'alarmist') {
        if (data.type === type) {
          var action = actions[data.action];
          if (action) {
            store.dispatch(action(Object.assign({
              name: _this.status.name,
              id: _this.status.id
            }, data.data)));
          }
        }
      }
    });
    this.stream.on('error', function (_error) {
      // TODO: ignore or debug errors?
    });
  }

  _createClass(JSONStream, [{
    key: 'write',
    value: function write(status) {
      this.status = status;
      this.stream.write(status.data);
    }
  }]);

  return JSONStream;
}();

exports.default = JSONStream;