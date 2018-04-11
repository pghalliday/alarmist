'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createView;

var _log = require('../common/view/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createView() {
  return new _log2.default();
}