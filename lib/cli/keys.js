'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKeys = createKeys;

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createKeys() {
  var keys = new _events2.default();
  _readline2.default.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', function (str, key) {
    if (key.sequence === '\x03') {
      process.exit();
    }
    keys.emit('keypress', key);
  });
  return keys;
}