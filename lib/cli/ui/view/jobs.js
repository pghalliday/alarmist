'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobs = createJobs;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _job = require('./job');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createJobs(layout) {
  var jobs = {};
  return {
    update: function update(state) {
      _lodash2.default.forOwn(state, function (status, name) {
        var existing = jobs[name];
        if (_lodash2.default.isUndefined(existing)) {
          var job = (0, _job.createJob)(name, layout);
          jobs[name] = {
            job: job,
            status: status
          };
          job.update(status);
        } else {
          if (status !== existing.status) {
            existing.job.update(status);
          }
        }
      });
    }
  };
}