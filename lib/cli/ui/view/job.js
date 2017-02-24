'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../helpers');

var _entry = require('./entry');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line max-len
var jobContent = function jobContent(status) {
  return ' ' + status.name + ': ' + status.id + ': ' + (_lodash2.default.isUndefined(status.exitCode) ? 'pending' : status.exitCode);
};
// eslint-disable-next-line max-len
var jobBg = function jobBg(status) {
  return _lodash2.default.isUndefined(status.exitCode) ? 'yellow' : status.exitCode === 0 ? 'green' : 'red';
};

function createJob(name, service, layout) {
  var entry = (0, _entry.createEntry)((0, _helpers.jobLabel)(name), layout);
  var id = void 0;
  var unsubscribe = void 0;
  return {
    update: function update(status) {
      var newId = status.id;
      if (newId !== id) {
        id = newId;
        if (unsubscribe) {
          unsubscribe();
        }
        entry.clear();
        unsubscribe = service.subscribeJobLog(name, id, function (data) {
          entry.log(data);
        });
      }
      entry.setHeader(jobContent(status), jobBg(status));
    }
  };
}

module.exports = {
  createJob: createJob
};