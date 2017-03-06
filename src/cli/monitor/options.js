import minimist from 'minimist';
import optionDefault from '../utils/option-default';
import _ from 'lodash';
import cliclopts from 'cliclopts';
import {
  WORKING_DIRECTORY_VAR,
  FORCE_COLOR_VAR,
  RESET_VAR,
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  DEFAULT_RESET_OPTION,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  NO_COMMAND_ERROR,
  MONITOR_USAGE_TEXT,
} from '../../constants';

// istanbul ignore next
const toBool = (value) => value === 'true';

const defaultReset = optionDefault(
  RESET_VAR,
  DEFAULT_RESET_OPTION,
  toBool,
);

const defaultColor = optionDefault(
  FORCE_COLOR_VAR,
  DEFAULT_COLOR_OPTION,
  toBool,
);

const defaultWorkingDirectory = optionDefault(
  WORKING_DIRECTORY_VAR,
  DEFAULT_WORKING_DIR,
);

const cliOpts = cliclopts([{
  name: 'working-dir',
  abbr: 'w',
  default: defaultWorkingDirectory,
  help: 'The directory in which to write logs, etc',
}, {
  name: 'reset',
  abbr: 'r',
  boolean: true,
  default: defaultReset,
  help: 'Reset the working directory on start',
}, {
  name: 'force-color',
  abbr: 'c',
  boolean: true,
  default: defaultColor,
  help: 'Set the FORCE_COLOR environment variable for watchers and jobs',
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
  return MONITOR_USAGE_TEXT + cliOpts.usage() + '\n';
}

export function parse(argv) {
  const parsed = minimist(argv, Object.assign(cliOpts.options(), {
    stopEarly: true,
  }));
  const command = parsed._[0];
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
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: MULTIPLE_WORKING_DIRECTORIES_ERROR,
    };
  }
  if (_.isUndefined(command)) {
    return {
      error: NO_COMMAND_ERROR,
    };
  }
  const args = parsed._.slice(1);
  const color = parsed['force-color'];
  const reset = parsed['reset'];
  const workingDir = parsed['working-dir'];
  return {
    command,
    args,
    color,
    reset,
    workingDir,
    help: false,
    version: false,
  };
};
