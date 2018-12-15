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

const defaultColor = (0, _optionDefault.default)(_constants.FORCE_COLOR_VAR, _constants.DEFAULT_COLOR_OPTION, toBool);
const defaultService = (0, _optionDefault.default)(_constants.SERVICE_VAR, _constants.DEFAULT_SERVICE_OPTION, toBool);
const defaultMetric = (0, _optionDefault.default)(_constants.METRIC_VAR, _constants.DEFAULT_METRIC_OPTION, toBool);
const defaultWorkingDirectory = (0, _optionDefault.default)(_constants.WORKING_DIRECTORY_VAR, _constants.DEFAULT_WORKING_DIR);
const cliOpts = (0, _cliclopts.default)([{
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
  const parsed = (0, _minimist.default)(argv, Object.assign(cliOpts.options(), {
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

  const name = parsed._[0];

  if (_lodash.default.isUndefined(name)) {
    return {
      error: _constants.NO_NAME_ERROR
    };
  }

  const command = parsed._[1];

  if (_lodash.default.isUndefined(command)) {
    return {
      error: _constants.NO_COMMAND_ERROR
    };
  }

  const args = parsed._.slice(2);

  const service = parsed['service'];
  const metric = parsed['metric'];
  const color = parsed['force-color'];
  const workingDir = parsed['working-dir'];
  return {
    name,
    command,
    args,
    color,
    service,
    metric,
    workingDir,
    help: false,
    version: false
  };
}

;