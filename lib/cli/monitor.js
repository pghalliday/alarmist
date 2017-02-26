'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function cli(argv) {
  var args = (0, _minimist2.default)(argv, {
    stopEarly: true
  });
  return _2.default.execMonitor({
    command: args._[0],
    args: args._.slice(1)
  }).then(_ui2.default.createUi).catch(
  // istanbul ignore next
  function (error) {
    console.error(error.stack);
  });
};