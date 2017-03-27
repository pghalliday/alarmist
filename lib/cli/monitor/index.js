'use strict';

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _options = require('./options');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function cli(argv) {
  var opts = (0, _options.parse)(argv);
  // istanbul ignore next
  if (opts.version) {
    console.log(require('../../../package.json').version);
    process.exit(0);
  }
  // istanbul ignore next
  if (opts.help) {
    process.stdout.write((0, _options.help)());
    process.exit(0);
  }
  // istanbul ignore next
  if (opts.error) {
    console.log('ERROR: ' + opts.error);
    process.stdout.write((0, _options.help)());
    process.exit(1);
  }
  return _2.default.execMonitor(opts).then(function (monitor) {
    return _ui2.default.createUi(monitor, opts.workingDir, opts.debug);
  }).catch(
  // istanbul ignore next
  function (error) {
    console.error(error.stack);
  });
};