"use strict";

var _store = _interopRequireDefault(require("./redux/store"));

var _service = require("./service");

var _view = require("./view");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createUi(monitor, workingDir, debug) {
  const service = (0, _service.createService)(monitor, _store.default);
  (0, _view.createView)(service, _store.default, workingDir, debug);
}

;
module.exports = {
  createUi
};