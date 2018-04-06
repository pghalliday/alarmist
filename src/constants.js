export const CONFIG_FILE_VAR = 'ALARMIST_CONFIG_FILE';
export const WORKING_DIRECTORY_VAR = 'ALARMIST_WORKING_DIRECTORY';
export const DEBUG_VAR = 'ALARMIST_DEBUG';
export const FORCE_COLOR_VAR = 'FORCE_COLOR';
export const TYPE_VAR = 'ALARMIST_TYPE';
export const RESET_VAR = 'ALARMIST_RESET';
export const DEFAULT_CONFIG_FILE = '.alarmist.js';
export const DEFAULT_WORKING_DIR = '.alarmist';
export const DEFAULT_DEBUG_OPTION = false;
export const DEFAULT_COLOR_OPTION = true;
export const DEFAULT_METRIC_OPTION = false;
export const DEFAULT_TYPE_OPTION = 'log';
export const DEFAULT_RESET_OPTION = true;
export const JOB_USAGE_TEXT = `
Usage: alarmist-job [options] <name> <command> [<arg>...]

Start a job. The working directory should match the
working directory of the monitor and usually this will
be the default. If the job is started via a watcher started
by the monitor then the 'ALARMIST_WORKING_DIRECTORY' environment
variable will have already been set.

Environment Variables:

${CONFIG_FILE_VAR}
${WORKING_DIRECTORY_VAR}
${FORCE_COLOR_VAR}
${TYPE_VAR}

<name>: The name of the job
<command>: The command to start the job
<arg>: arguments for the command

Options:
`;
export const MONITOR_USAGE_TEXT = `
Usage: alarmist-monitor [options] <command> [<arg>...]

Start monitoring jobs. If multiple monitors need to be run
in the same directory then use the '--working-dir' option
or export the 'ALARMIST_WORKING_DIRECTORY' variable to keep
them separated. This will also export the
'ALARMIST_WORKING_DIRECTORY' environment variable for use by
jobs started by the watcher tasks.

Environment Variables:

${CONFIG_FILE_VAR}
${WORKING_DIRECTORY_VAR}
${FORCE_COLOR_VAR}
${RESET_VAR}
${DEBUG_VAR}

<command>: The command to start the watcher tasks
<arg>: arguments for the command

Options:
`;
// eslint-disable-next-line max-len
export const MULTIPLE_WORKING_DIRECTORIES_ERROR = 'Working directory specified multiple times';
// eslint-disable-next-line max-len
export const MULTIPLE_CONFIG_FILES_ERROR = 'Config file specified multiple times';
// eslint-disable-next-line max-len
export const MULTIPLE_TYPES_ERROR = 'Type specified multiple times';
export const NO_COMMAND_ERROR = 'Command not specified';
export const NO_NAME_ERROR = 'Name not specified';
export const JOBS_DIR = 'jobs';
export const UI_LOG = 'ui.log';
export const MONITOR_LOG = 'monitor.log';
export const RUN_LOG = 'run.log';
export const STATUS_FILE = 'status.json';
export const ID_FILE = 'last-run';
export const CONTROL_SOCKET = 'control.sock';
export const LOG_SOCKET = 'log.sock';
export const READY_RESPONSE = 'ready';
