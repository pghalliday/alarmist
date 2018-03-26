'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../helpers');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jobs = function () {
  function Jobs(_ref) {
    var Job = _ref.Job,
        Metric = _ref.Metric,
        Table = _ref.Table,
        Service = _ref.Service,
        layout = _ref.layout;

    _classCallCheck(this, Jobs);

    this.classes = {};
    this.classes[_constants.TYPE_JOB] = Job;
    this.classes[_constants.TYPE_TABLE] = Table;
    this.classes[_constants.TYPE_METRIC] = Metric;
    this.classes[_constants.TYPE_SERVICE] = Service;
    this.layout = layout;
    this.jobs = {};
  }

  _createClass(Jobs, [{
    key: 'update',
    value: function update(state) {
      var _this = this;

      _lodash2.default.forOwn(state, function (status, name) {
        var existing = _this.jobs[name];
        if (_lodash2.default.isUndefined(existing)) {
          var JobClass = _this.classes[status.type];
          var job = new JobClass();
          _this.jobs[name] = {
            job: job,
            status: status
          };
          _this.layout.append((0, _helpers.jobLabel)(name), job);
          job.update(status);
        } else {
          if (status !== existing.status) {
            existing.job.update(status);
          }
        }
      });
    }
  }]);

  return Jobs;
}();

exports.default = Jobs;