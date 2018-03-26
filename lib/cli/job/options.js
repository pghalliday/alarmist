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

var defaultService = (0, _optionDefault2.default)(_constants.SERVICE_VAR, _constants.DEFAULT_SERVICE_OPTION, toBool);

var defaultMetric = (0, _optionDefault2.default)(_constants.METRIC_VAR, _constants.DEFAULT_METRIC_OPTION, toBool);

var defaultTable = (0, _optionDefault2.default)(_constants.TABLE_VAR, _constants.DEFAULT_TABLE_OPTION, toBool);

var defaultWorkingDirectory = (0, _optionDefault2.default)(_constants.WORKING_DIRECTORY_VAR, _constants.DEFAULT_WORKING_DIR);

var cliOpts = (0, _cliclopts2.default)([{
  name: 'working-dir',
  abbr: 'w',
  default: defaultWorkingDirectory,
  help: 'The directory in which to write logs, etc'
}, {
  name: 'service',
  abbr: 's',
  boolean: true,
  default: defaultService,
  help: 'Flag the job as a service'
}, {
  name: 'metric',
  abbr: 'm',
  boolean: true,
  default: defaultMetric,
  help: 'Flag the job as a metric'
}, {
  name: 'table',
  abbr: 't',
  boolean: true,
  default: defaultTable,
  help: 'Flag the job as a table'
}, {
  name: 'force-color',
  abbr: 'c',
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
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: _constants.MULTIPLE_WORKING_DIRECTORIES_ERROR
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
  var service = parsed['service'];
  var metric = parsed['metric'];
  var table = parsed['table'];
  var color = parsed['force-color'];
  var workingDir = parsed['working-dir'];
  return {
    name: name,
    command: command,
    args: args,
    color: color,
    service: service,
    metric: metric,
    table: table,
    workingDir: workingDir,
    help: false,
    version: false
  };
};