"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.READY_RESPONSE = exports.LOG_SOCKET = exports.CONTROL_SOCKET = exports.ID_FILE = exports.STATUS_FILE = exports.RUN_LOG = exports.MONITOR_LOG = exports.UI_LOG = exports.JOBS_DIR = exports.NO_NAME_ERROR = exports.NO_COMMAND_ERROR = exports.MULTIPLE_WORKING_DIRECTORIES_ERROR = exports.MONITOR_USAGE_TEXT = exports.JOB_USAGE_TEXT = exports.DEFAULT_RESET_OPTION = exports.DEFAULT_METRIC_OPTION = exports.DEFAULT_SERVICE_OPTION = exports.DEFAULT_COLOR_OPTION = exports.DEFAULT_DEBUG_OPTION = exports.DEFAULT_WORKING_DIR = exports.RESET_VAR = exports.METRIC_VAR = exports.SERVICE_VAR = exports.FORCE_COLOR_VAR = exports.DEBUG_VAR = exports.WORKING_DIRECTORY_VAR = void 0;
const WORKING_DIRECTORY_VAR = 'ALARMIST_WORKING_DIRECTORY';
exports.WORKING_DIRECTORY_VAR = WORKING_DIRECTORY_VAR;
const DEBUG_VAR = 'ALARMIST_DEBUG';
exports.DEBUG_VAR = DEBUG_VAR;
const FORCE_COLOR_VAR = 'FORCE_COLOR';
exports.FORCE_COLOR_VAR = FORCE_COLOR_VAR;
const SERVICE_VAR = 'ALARMIST_SERVICE';
exports.SERVICE_VAR = SERVICE_VAR;
const METRIC_VAR = 'ALARMIST_METRIC';
exports.METRIC_VAR = METRIC_VAR;
const RESET_VAR = 'ALARMIST_RESET';
exports.RESET_VAR = RESET_VAR;
const DEFAULT_WORKING_DIR = '.alarmist';
exports.DEFAULT_WORKING_DIR = DEFAULT_WORKING_DIR;
const DEFAULT_DEBUG_OPTION = false;
exports.DEFAULT_DEBUG_OPTION = DEFAULT_DEBUG_OPTION;
const DEFAULT_COLOR_OPTION = true;
exports.DEFAULT_COLOR_OPTION = DEFAULT_COLOR_OPTION;
const DEFAULT_SERVICE_OPTION = false;
exports.DEFAULT_SERVICE_OPTION = DEFAULT_SERVICE_OPTION;
const DEFAULT_METRIC_OPTION = false;
exports.DEFAULT_METRIC_OPTION = DEFAULT_METRIC_OPTION;
const DEFAULT_RESET_OPTION = true;
exports.DEFAULT_RESET_OPTION = DEFAULT_RESET_OPTION;
const JOB_USAGE_TEXT = `
Usage: alarmist-job [options] <name> <command> [<arg>...]

Start a job. The working directory should match the
working directory of the monitor and usually this will
be the default. If the job is started via a watcher started
by the monitor then the 'ALARMIST_WORKING_DIRECTORY' environment
variable will have already been set.

A job can be flagged as a service. Services are processes
that are not supposed to exit. As such they will be shown as OK
as long as they are running and error if they exit. The main
use case is to capture the logs from a long running process, such
as a web server, separately.

A job can be flagged as a metric. Metrics, like services, are
processes that are not supposed to exit. Metrics will be rendered
as a chart with the current value displayed in the header. Metric
processes should use the following csv standard for console output.

<value>,<status>,<message>\\n

value - will be parsed as a float
status - specifies the color to use for the header (0: green, 1: yellow, 2: red)
message - the remainder of the line will be appended to the header value

Environment Variables:

${FORCE_COLOR_VAR}
${WORKING_DIRECTORY_VAR}
${SERVICE_VAR}
${METRIC_VAR}

<name>: The name of the job
<command>: The command to start the job
<arg>: arguments for the command

Options:
`;
exports.JOB_USAGE_TEXT = JOB_USAGE_TEXT;
const MONITOR_USAGE_TEXT = `
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
`; // eslint-disable-next-line max-len

exports.MONITOR_USAGE_TEXT = MONITOR_USAGE_TEXT;
const MULTIPLE_WORKING_DIRECTORIES_ERROR = 'Working directory specified multiple times';
exports.MULTIPLE_WORKING_DIRECTORIES_ERROR = MULTIPLE_WORKING_DIRECTORIES_ERROR;
const NO_COMMAND_ERROR = 'Command not specified';
exports.NO_COMMAND_ERROR = NO_COMMAND_ERROR;
const NO_NAME_ERROR = 'Name not specified';
exports.NO_NAME_ERROR = NO_NAME_ERROR;
const JOBS_DIR = 'jobs';
exports.JOBS_DIR = JOBS_DIR;
const UI_LOG = 'ui.log';
exports.UI_LOG = UI_LOG;
const MONITOR_LOG = 'monitor.log';
exports.MONITOR_LOG = MONITOR_LOG;
const RUN_LOG = 'run.log';
exports.RUN_LOG = RUN_LOG;
const STATUS_FILE = 'status.json';
exports.STATUS_FILE = STATUS_FILE;
const ID_FILE = 'last-run';
exports.ID_FILE = ID_FILE;
const CONTROL_SOCKET = 'control.sock';
exports.CONTROL_SOCKET = CONTROL_SOCKET;
const LOG_SOCKET = 'log.sock';
exports.LOG_SOCKET = LOG_SOCKET;
const READY_RESPONSE = 'ready';
exports.READY_RESPONSE = READY_RESPONSE;