'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function job(argv) {
  var args = (0, _minimist2.default)(argv, {
    string: ['name'],
    alias: {
      name: 'n'
    },
    stopEarly: true
  });
  return _2.default.execJob({
    name: args.name,
    command: args._[0],
    args: args._.slice(1)
  }).catch(
  // istanbul ignore next
  function (error) {
    console.error(error.stack);
  });
};