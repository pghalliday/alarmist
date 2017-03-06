import minimist from 'minimist';
import optionDefault from '../utils/option-default';
import _ from 'lodash';
import cliclopts from 'cliclopts';
import {
  WORKING_DIRECTORY_VAR,
  FORCE_COLOR_VAR,
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  NO_NAME_ERROR,
  NO_COMMAND_ERROR,
  JOB_USAGE_TEXT,
} from '../../constants';

const defaultColor = optionDefault(
  FORCE_COLOR_VAR,
  DEFAULT_COLOR_OPTION,
  (value) => value === 'true',
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
  name: 'force-color',
  abbr: 'c',
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
  if (parsed['working-dir'] instanceof Array) {
    return {
      error: MULTIPLE_WORKING_DIRECTORIES_ERROR,
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
  const color = parsed['force-color'];
  const workingDir = parsed['working-dir'];
  return {
    name,
    command,
    args,
    color,
    workingDir,
    help: false,
    version: false,
  };
};
