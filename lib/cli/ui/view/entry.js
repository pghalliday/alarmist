'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntry(label, layout) {
  var header = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.HEADER_PROPERTIES));
  var _log = _blessed2.default.log(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
  layout.append(label, header, _log);
  return {
    setHeader: function setHeader(content, color) {
      header.content = content;
      header.style.bg = color;
    },
    log: function log(data) {
      _log.log(data.toString());
    },
    clear: function clear() {
      _log.content = '';
    }
  };
}

module.exports = {
  createEntry: createEntry
};