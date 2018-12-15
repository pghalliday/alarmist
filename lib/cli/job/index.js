"use strict";

var _options = require("./options");

var _ = _interopRequireDefault(require("../../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function job(argv) {
  const opts = (0, _options.parse)(argv); // istanbul ignore next

  if (opts.version) {
    console.log(require('../../../package.json').version);
    process.exit(0);
  } // istanbul ignore next


  if (opts.help) {
    process.stdout.write((0, _options.help)());
    process.exit(0);
  } // istanbul ignore next


  if (opts.error) {
    console.log('ERROR: ' + opts.error);
    process.stdout.write((0, _options.help)());
    process.exit(1);
  }

  return _.default.execJob(opts).catch( // istanbul ignore next
  error => {
    console.error(error.stack);
  });
};