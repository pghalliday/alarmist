"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Jobs {
  constructor(Job, Metric, layout) {
    this.Job = Job;
    this.Metric = Metric;
    this.layout = layout;
    this.jobs = {};
  }

  update(state) {
    _lodash.default.forOwn(state, (status, name) => {
      const existing = this.jobs[name];

      if (_lodash.default.isUndefined(existing)) {
        const job = status.metric ? new this.Metric() : new this.Job();
        this.jobs[name] = {
          job: job,
          status: status
        };
        this.layout.append((0, _helpers.jobLabel)(name), job);
        job.update(status);
      } else {
        if (status !== existing.status) {
          existing.job.update(status);
        }
      }
    });
  }

}

exports.default = Jobs;