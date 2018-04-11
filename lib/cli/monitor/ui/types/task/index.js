'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createView: _view2.default,
  createService: _service2.default,
  createReducer: _reducer2.default
};