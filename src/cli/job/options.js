import minimist from 'minimist';
import optionDefault from '../utils/option-default';
import _ from 'lodash';
import cliclopts from 'cliclopts';
import {
  CONFIG_FILE_VAR,
  WORKING_DIRECTORY_VAR,
  FORCE_COLOR_VAR,
  TYPE_VAR,
  DEFAULT_CONFIG_FILE,
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  DEFAULT_TYPE_OPTION,
  MULTIPLE_CONFIG_FILES_ERROR,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  MULTIPLE_TYPES_ERROR,
  NO_NAME_ERROR,
  NO_COMMAND_ERROR,
  JOB_USAGE_TEXT,
} from '../../constants';

// istanbul ignore next
const toBool = (value) => value === 'true';

const defaultColor = optionDefault(
  FORCE_COLOR_VAR,
  DEFAULT_COLOR_OPTION,
  toBool,
);

const defaultType = optionDefault(
  TYPE_VAR,
  DEFAULT_TYPE_OPTION,
);

const defaultConfigFile = optionDefault(
  CONFIG_FILE_VAR,
  DEFAULT_CONFIG_FILE,
);

const defaultWorkingDirectory = optionDefault(
  WORKING_DIRECTORY_VAR,
  DEFAULT_WORKING_DIR,
);

const cliOpts = cliclopts([{
  name: 'config-file',
  abbr: 'c',
  default: defaultConfigFile,
  help: 'The config file to load options from if present',
}, {
  name: 'working-dir',
  abbr: 'w',
  default: defaultWorkingDirectory,
  help: 'The directory in which to write logs, etc',
}, {
  name: 'type',
  abbr: 't',
  default: defaultType,
  help: 'The type of the job',
}, {
  name: 'force-color',
  abbr: 'f',
  boolean: true,
  default: defaultColor,
  help: 'Set the FORCE_COLOR environment variable for the job',
}, {
  name: 'help',
  abbr: 'h',
  alias: ['?'],
  boolean: true,
  help: 'Show help',
}, {
  name: 'version',
  abbr: 'v',
  boolean: true,
  help: 'Show version number',
}]);

export function help() {
  return JOB_USAGE_TEXT + cliOpts.usage() + '\n';
}

export function parse(argv) {
  const parsed = minimist(argv, Object.assign(cliOpts.options(), {
    stopEarly: true,
  }));
  if (parsed.version) {
    return {
      version: true,
    };
  }
  if (parsed.help) {
    return {
      help: true,
    };
  }
  if (parsed['config-file'] instanceof Array) {
    return {
      error: MULTIPLE_CONFIG_FILES_ERROR,
    };
  }
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: MULTIPLE_WORKING_DIRECTORIES_ERROR,
    };
  }
  if (parsed['type'] instanceof Array) {
    return {
      error: MULTIPLE_TYPES_ERROR,
    };
  }
  const name = parsed._[0];
  if (_.isUndefined(name)) {
    return {
      error: NO_NAME_ERROR,
    };
  }
  const command = parsed._[1];
  if (_.isUndefined(command)) {
    return {
      error: NO_COMMAND_ERROR,
    };
  }
  const args = parsed._.slice(2);
  const type = parsed['type'];
  const color = parsed['force-color'];
  const workingDir = parsed['working-dir'];
  const configFile = parsed['config-file'];
  return {
    name,
    command,
    args,
    color,
    type,
    workingDir,
    configFile,
    help: false,
    version: false,
  };
};
