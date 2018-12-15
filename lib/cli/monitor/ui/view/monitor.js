"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _log = _interopRequireDefault(require("./log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Monitor extends _log.default {
  constructor() {
    super();
    this.type = 'Monitor';
  }

  _update(state) {
    if (_lodash.default.isUndefined(state.error)) {
      this.setHeader(' monitor: ok', 'green');
    } else {
      this.setHeader(` monitor: ${state.error}`, 'red');
    }

    this.setLog(state.log);
  }

}

exports.default = Monitor;