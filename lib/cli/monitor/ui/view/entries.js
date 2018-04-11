'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entries = function () {
  function Entries(_ref) {
    var types = _ref.types,
        layout = _ref.layout;

    _classCallCheck(this, Entries);

    this.types = types;
    this.layout = layout;
    this.entries = {};
  }

  _createClass(Entries, [{
    key: 'update',
    value: function update(state) {
      var _this = this;

      _lodash2.default.forOwn(state, function (status, name) {
        var existing = _this.entries[name];
        if (_lodash2.default.isUndefined(existing)) {
          var type = _this.types[status.type];
          // istanbul ignore else
          if (type) {
            var entry = type.createView(name);
            _this.entries[name] = {
              entry: entry,
              status: status
            };
            _this.layout.append(name, entry);
          } else {
            _logger2.default.log('No view available for this type of entry: ' + type);
          }
        } else {
          if (status !== existing.status) {
            existing.entry.update(status);
          }
        }
      });
    }
  }]);

  return Entries;
}();

exports.default = Entries;