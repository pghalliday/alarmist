"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.parse = parse;

var _minimist = _interopRequireDefault(require("minimist"));

var _optionDefault = _interopRequireDefault(require("../utils/option-default"));

var _lodash = _interopRequireDefault(require("lodash"));

var _cliclopts = _interopRequireDefault(require("cliclopts"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// istanbul ignore next
const toBool = value => value === 'true';

const defaultDebug = (0, _optionDefault.default)(_constants.DEBUG_VAR, _constants.DEFAULT_DEBUG_OPTION, toBool);
const defaultReset = (0, _optionDefault.default)(_constants.RESET_VAR, _constants.DEFAULT_RESET_OPTION, toBool);
const defaultColor = (0, _optionDefault.default)(_constants.FORCE_COLOR_VAR, _constants.DEFAULT_COLOR_OPTION, toBool);
const defaultWorkingDirectory = (0, _optionDefault.default)(_constants.WORKING_DIRECTORY_VAR, _constants.DEFAULT_WORKING_DIR);
const cliOpts = (0, _cliclopts.default)([{
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
  name: 'debug',
  abbr: 'd',
  boolean: true,
  default: defaultDebug,
  help: 'Enable additional UI debug in the ui.log'
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
  const parsed = (0, _minimist.default)(argv, Object.assign(cliOpts.options(), {
    stopEarly: true
  }));
  const command = parsed._[0];

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

  if (_lodash.default.isUndefined(command)) {
    return {
      error: _constants.NO_COMMAND_ERROR
    };
  }

  const args = parsed._.slice(1);

  const debug = parsed['debug'];
  const color = parsed['force-color'];
  const reset = parsed['reset'];
  const workingDir = parsed['working-dir'];
  return {
    command,
    args,
    debug,
    color,
    reset,
    workingDir,
    help: false,
    version: false
  };
}

;