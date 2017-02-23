'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tail = require('tail');

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntry(label, layout) {
  var textElement = _blessed2.default.text(_lodash2.default.cloneDeep(_constants.TEXT_PROPERTIES));
  var logElement = _blessed2.default.log(_lodash2.default.cloneDeep(_constants.LOG_PROPERTIES));
  var tail = void 0;
  var onLine = function onLine(data) {
    logElement.log(data);
  };
  layout.append(label, textElement, logElement);
  return {
    setHeader: function setHeader(content, color) {
      textElement.content = content;
      textElement.style.bg = color;
    },
    setLog: function setLog(logFilePath) {
      if (!_lodash2.default.isUndefined(tail)) {
        tail.unwatch();
        tail.removeListener('line', onLine);
      }
      tail = new _tail.Tail(logFilePath, _constants.TAIL_OPTIONS);
      tail.on('line', onLine);
    }
  };
}

module.exports = {
  createEntry: createEntry
};