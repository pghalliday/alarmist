'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tail = require('tail');

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntry(label, layout) {
  var header = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.HEADER_PROPERTIES));
  var log = _blessed2.default.log(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
  var tail = void 0;
  var onLine = function onLine(data) {
    log.log(data);
    log.render();
  };
  layout.append(label, header, log);
  return {
    setHeader: function setHeader(content, color) {
      header.content = content;
      header.style.bg = color;
    },
    setLog: function setLog(logFilePath) {
      if (!_lodash2.default.isUndefined(tail)) {
        tail.unwatch();
        tail.removeListener('line', onLine);
      }
      log.content = '';
      tail = new _tail.Tail(logFilePath, _constants.TAIL_OPTIONS);
      tail.on('line', onLine);
    }
  };
}

module.exports = {
  createEntry: createEntry
};