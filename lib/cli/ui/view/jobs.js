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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var status = _step.value;

          var existing = jobs[status.name];
          if (_lodash2.default.isUndefined(existing)) {
            var job = (0, _job.createJob)(layout);
            jobs[status.name] = {
              job: job,
              status: status
            };
            job.update(status);
          } else {
            if (status !== existing.status) {
              existing.job.update(status);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };
}