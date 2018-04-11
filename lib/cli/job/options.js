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

// istanbul ignore next
var toBool = function toBool(value) {
  return value === 'true';
};

var defaultColor = (0, _optionDefault2.default)(_constants.FORCE_COLOR_VAR, _constants.DEFAULT_COLOR_OPTION, toBool);

var defaultType = (0, _optionDefault2.default)(_constants.TYPE_VAR, _constants.DEFAULT_TYPE_OPTION);

var defaultConfigFile = (0, _optionDefault2.default)(_constants.CONFIG_FILE_VAR, _constants.DEFAULT_CONFIG_FILE);

var defaultWorkingDirectory = (0, _optionDefault2.default)(_constants.WORKING_DIRECTORY_VAR, _constants.DEFAULT_WORKING_DIR);

var cliOpts = (0, _cliclopts2.default)([{
  name: 'config-file',
  abbr: 'c',
  default: defaultConfigFile,
  help: 'The config file to load options from if present'
}, {
  name: 'working-dir',
  abbr: 'w',
  default: defaultWorkingDirectory,
  help: 'The directory in which to write logs, etc'
}, {
  name: 'type',
  abbr: 't',
  default: defaultType,
  help: 'The type of the job'
}, {
  name: 'force-color',
  abbr: 'f',
  boolean: true,
  default: defaultColor,
  help: 'Set the FORCE_COLOR environment variable for the job'
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
  return _constants.JOB_USAGE_TEXT + cliOpts.usage() + '\n';
}

function parse(argv) {
  var parsed = (0, _minimist2.default)(argv, Object.assign(cliOpts.options(), {
    stopEarly: true
  }));
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
  if (parsed['config-file'] instanceof Array) {
    return {
      error: _constants.MULTIPLE_CONFIG_FILES_ERROR
    };
  }
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: _constants.MULTIPLE_WORKING_DIRECTORIES_ERROR
    };
  }
  if (parsed['type'] instanceof Array) {
    return {
      error: _constants.MULTIPLE_TYPES_ERROR
    };
  }
  var name = parsed._[0];
  if (_lodash2.default.isUndefined(name)) {
    return {
      error: _constants.NO_NAME_ERROR
    };
  }
  var command = parsed._[1];
  if (_lodash2.default.isUndefined(command)) {
    return {
      error: _constants.NO_COMMAND_ERROR
    };
  }
  var args = parsed._.slice(2);
  var type = parsed['type'];
  var color = parsed['force-color'];
  var workingDir = parsed['working-dir'];
  var configFile = parsed['config-file'];
  return {
    name: name,
    command: command,
    args: args,
    color: color,
    type: type,
    workingDir: workingDir,
    configFile: configFile,
    help: false,
    version: false
  };
};