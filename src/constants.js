export const WORKING_DIRECTORY_VAR = 'ALARMIST_WORKING_DIRECTORY';
export const DEBUG_VAR = 'ALARMIST_DEBUG';
export const FORCE_COLOR_VAR = 'FORCE_COLOR';
export const SERVICE_VAR = 'ALARMIST_SERVICE';
export const RESET_VAR = 'ALARMIST_RESET';
export const DEFAULT_WORKING_DIR = '.alarmist';
export const DEFAULT_DEBUG_OPTION = false;
export const DEFAULT_COLOR_OPTION = true;
export const DEFAULT_SERVICE_OPTION = false;
export const DEFAULT_RESET_OPTION = true;
export const JOB_USAGE_TEXT = `
Usage: alarmist-job [options] <name> <command> [<arg>...]

Start a job. The working directory should match the
working directory of the monitor and usually this will
be the default. If the job is started via a watcher started
by the monitor then the 'ALARMIST_WORKING_DIRECTORY' environment
variable will have already been set.

A job can also be flagged as a service. Services are processes
that are not supposed to exit. As such they will be shown as OK
as long as they are running and error if they exit. The main
use case is to capture the logs from a long running process, such
as a web server, separately.

<name>: The name of the job
<command>: The command to start the job
<arg>: arguments for the command

Environment Variables:

${FORCE_COLOR_VAR}
${WORKING_DIRECTORY_VAR}
${SERVICE_VAR}

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

${FORCE_COLOR_VAR}
${WORKING_DIRECTORY_VAR}
${RESET_VAR}
${DEBUG_VAR}

<command>: The command to start the watcher tasks
<arg>: arguments for the command

Options:
`;
// eslint-disable-next-line max-len
export const MULTIPLE_WORKING_DIRECTORIES_ERROR = 'Working directory specified multiple times';
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
