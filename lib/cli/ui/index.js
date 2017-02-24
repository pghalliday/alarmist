'use strict';

var _store = require('./redux/store');

var _store2 = _interopRequireDefault(_store);

var _service = require('./service');

var _view = require('./view');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
function createUi(monitor) {
  var service = (0, _service.createService)(monitor, _store2.default);
  (0, _view.createView)(service, _store2.default);
};

module.exports = {
  createUi: createUi
};