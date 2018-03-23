'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _asciichart = require('asciichart');

var _asciichart2 = _interopRequireDefault(_asciichart);

var _constants = require('./constants');

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATUS_COLORS = ['green', 'yellow', 'red'];

// check if there is a non zero range of values
function rangeIsGood(values) {
  var min = void 0;
  var max = void 0;
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    min = Math.min(value, min || value);
    max = Math.max(value, max || value);
    if (min < max) {
      return true;
    }
  }
  return false;
}

function parseValue(line) {
  var fields = line.split(',');
  return parseFloat(fields[0]);
}

function parseEntry(line) {
  var fields = line.split(',');
  return {
    value: parseFloat(fields.shift()),
    status: parseInt(fields.shift() || 0),
    message: fields.join(',')
  };
}

function latestEntry(lines) {
  var latestLine = lines[lines.length - 2];
  if (latestLine) {
    return parseEntry(latestLine);
  }
}

function jobContent(status, entry) {
  var message = 'ok';
  if (_lodash2.default.isUndefined(status.endTime)) {
    if (entry) {
      if (entry.message) {
        message = entry.value + ' - ' + entry.message;
      } else {
        message = entry.value;
      }
    }
  } else {
    message = _lodash2.default.isUndefined(status.error) ? 'ended' : status.error;
  }
  return ' ' + status.name + ': ' + message;
}

function jobBg(status, entry) {
  if (_lodash2.default.isUndefined(status.endTime)) {
    if (entry) {
      if (entry.status) {
        return STATUS_COLORS[entry.status] || 'red';
      } else {
        return 'green';
      }
    } else {
      return 'green';
    }
  } else {
    return 'red';
  }
}

var Metric = function (_Entry) {
  _inherits(Metric, _Entry);

  function Metric() {
    _classCallCheck(this, Metric);

    var _this = _possibleConstructorReturn(this, (Metric.__proto__ || Object.getPrototypeOf(Metric)).call(this));

    _this.expanded = false;
    _this.chart = _blessed2.default.box(_lodash2.default.cloneDeep(_constants.CHART_PROPERTIES));
    _this.chart.hide();
    _this.clear();
    return _this;
  }

  _createClass(Metric, [{
    key: '_setContentParent',
    value: function _setContentParent(container) {
      container.append(this.chart);
    }
  }, {
    key: '_update',
    value: function _update(status) {
      var subsetLength = this.chart.width - _constants.CHART_PADDING.length - 2;
      // istanbul ignore else
      if (subsetLength > 1) {
        // the last line should always be incomplete so
        // take the last subsetLength complete lines and parse the values
        var subset = status.lines.slice(-subsetLength - 1, -1).map(parseValue);
        // asciichart will fall over if the range of values has zero size
        if (rangeIsGood(subset)) {
          this.chart.setContent(_asciichart2.default.plot(subset, {
            padding: _constants.CHART_PADDING,
            height: this.chart.height - 1
          }));
        } else {
          this.clear();
        }
      }
      var entry = latestEntry(status.lines);
      this.setHeader(jobContent(status, entry), jobBg(status, entry));
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.chart.setContent('');
    }
  }, {
    key: 'setContentHeight',
    value: function setContentHeight(height) {
      this.chart.height = height;
    }
  }, {
    key: '_setContentTop',
    value: function _setContentTop(top) {
      this.chart.top = top;
    }
    // istanbul ignore next

  }, {
    key: 'collapse',
    value: function collapse() {
      if (this.expanded) {
        this.expanded = false;
        this.chart.hide();
      }
    }
    // istanbul ignore next

  }, {
    key: 'expand',
    value: function expand() {
      if (!this.expanded) {
        this.chart.show();
        this.expanded = true;
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.chart.focus();
    }
  }]);

  return Metric;
}(_entry2.default);

exports.default = Metric;