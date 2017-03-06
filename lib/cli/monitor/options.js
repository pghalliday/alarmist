'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.parse = parse;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _optionDefault = require('../utils/option-default');

var _optionDefault2 = _interopRequireDefault(_optionDefault);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cliclopts = require('cliclopts');

var _cliclopts2 = _interopRequireDefault(_cliclopts);

var _constants = require('../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toBool = function toBool(value) {
  return value === 'true';
};

var defaultReset = (0, _optionDefault2.default)(_constants.RESET_VAR, _constants.DEFAULT_RESET_OPTION, toBool);

var defaultColor = (0, _optionDefault2.default)(_constants.FORCE_COLOR_VAR, _constants.DEFAULT_COLOR_OPTION, toBool);

var defaultWorkingDirectory = (0, _optionDefault2.default)(_constants.WORKING_DIRECTORY_VAR, _constants.DEFAULT_WORKING_DIR);

var cliOpts = (0, _cliclopts2.default)([{
  name: 'working-dir',
  abbr: 'w',
  default: defaultWorkingDirectory,
  help: 'The directory in which to write logs, etc'
}, {
  name: 'reset',
  abbr: 'r',
  boolean: true,
  default: defaultReset,
  help: 'Reset the working directory on start'
}, {
  name: 'force-color',
  abbr: 'c',
  boolean: true,
  default: defaultColor,
  help: 'Set the FORCE_COLOR environment variable for watchers and jobs'
}, {
  name: 'help',
  abbr: 'h',
  alias: ['?'],
  boolean: true,
  help: 'Show help'
}, {
  name: 'version',
  abbr: 'v',
  boolean: true,
  help: 'Show version number'
}]);

function help() {
  return _constants.MONITOR_USAGE_TEXT + cliOpts.usage() + '\n';
}

function parse(argv) {
  var parsed = (0, _minimist2.default)(argv, Object.assign(cliOpts.options(), {
    stopEarly: true
  }));
  var command = parsed._[0];
  if (parsed.version) {
    return {
      version: true
    };
  }
  if (parsed.help) {
    return {
      help: true
    };
  }
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: _constants.MULTIPLE_WORKING_DIRECTORIES_ERROR
    };
  }
  if (_lodash2.default.isUndefined(command)) {
    return {
      error: _constants.NO_COMMAND_ERROR
    };
  }
  var args = parsed._.slice(1);
  var color = parsed['force-color'];
  var reset = parsed['reset'];
  var workingDir = parsed['working-dir'];
  return {
    command: command,
    args: args,
    color: color,
    reset: reset,
    workingDir: workingDir,
    help: false,
    version: false
  };
};