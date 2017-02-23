'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line max-len
var jobContent = function jobContent(status) {
  return ' ' + status.name + ': ' + status.id + ': ' + (_lodash2.default.isUndefined(status.exitCode) ? 'pending' : status.exitCode);
};
// eslint-disable-next-line max-len
var jobBg = function jobBg(status) {
  return _lodash2.default.isUndefined(status.exitCode) ? 'yellow' : status.exitCode === 0 ? 'green' : 'red';
};

function createJob(layout) {
  var element = _blessed2.default.text(_constants.TEXT_PROPERTIES);
  layout.append(element);
  return {
    update: function update(status) {
      element.content = jobContent(status);
      element.style.bg = jobBg(status);
    }
  };
}

module.exports = {
  createJob: createJob
};