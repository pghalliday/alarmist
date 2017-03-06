'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WORKING_DIRECTORY_VAR = exports.WORKING_DIRECTORY_VAR = 'ALARMIST_WORKING_DIRECTORY';
var FORCE_COLOR_VAR = exports.FORCE_COLOR_VAR = 'FORCE_COLOR';
var DEFAULT_WORKING_DIR = exports.DEFAULT_WORKING_DIR = '.alarmist';
var DEFAULT_COLOR_OPTION = exports.DEFAULT_COLOR_OPTION = true;
var DEFAULT_RESET_OPTION = exports.DEFAULT_RESET_OPTION = true;
var JOB_USAGE_TEXT = exports.JOB_USAGE_TEXT = '\nUsage: alarmist-job [options] <name> <command> [<arg>...]\n\nStart a job. The working directory should match the\nworking directory of the monitor and usually this will\nbe the default. If the job is started via a watcher started\nby the monitor then the \'ALARMIST_WORKING_DIRECTORY\' environment\nvariable will have already been set.\n\n<name>: The name of the job\n<command>: The command to start the job\n<arg>: arguments for the command\n\nOptions:\n';
var MONITOR_USAGE_TEXT = exports.MONITOR_USAGE_TEXT = '\nUsage: alarmist-monitor [options] <command> [<arg>...]\n\nStart monitoring jobs. If multiple monitors need to be run\nin the same directory then use the \'--working-dir\' option\nor export the \'ALARMIST_WORKING_DIRECTORY\' variable to keep\nthem separated. This will also export the\n\'ALARMIST_WORKING_DIRECTORY\' environment variable for use by\njobs started by the watcher tasks.\n\n<command>: The command to start the watcher tasks\n<arg>: arguments for the command\n\nOptions:\n';
// eslint-disable-next-line max-len
var MULTIPLE_WORKING_DIRECTORIES_ERROR = exports.MULTIPLE_WORKING_DIRECTORIES_ERROR = 'Working directory specified multiple times';
var NO_COMMAND_ERROR = exports.NO_COMMAND_ERROR = 'Command not specified';
var NO_NAME_ERROR = exports.NO_NAME_ERROR = 'Name not specified';
var JOBS_DIR = exports.JOBS_DIR = 'jobs';
var UI_LOG = exports.UI_LOG = 'ui.log';
var MONITOR_LOG = exports.MONITOR_LOG = 'monitor.log';
var RUN_LOG = exports.RUN_LOG = 'run.log';
var STATUS_FILE = exports.STATUS_FILE = 'status.json';
var ID_FILE = exports.ID_FILE = 'last-run';
var CONTROL_SOCKET = exports.CONTROL_SOCKET = 'control.sock';
var LOG_SOCKET = exports.LOG_SOCKET = 'log.sock';
var READY_RESPONSE = exports.READY_RESPONSE = 'ready';