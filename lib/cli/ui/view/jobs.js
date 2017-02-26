'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jobs = function () {
  function Jobs(Job, layout) {
    _classCallCheck(this, Jobs);

    this.Job = Job;
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
          var job = new _this.Job();
          _this.jobs[name] = {
            job: job,
            status: status
          };
          job.update(status);
          _this.layout.append((0, _helpers.jobLabel)(name), job);
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