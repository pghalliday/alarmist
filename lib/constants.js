'use strict';

var WORKING_DIR = '.alarmist';
var JOBS_DIR = 'jobs';
var UI_LOG = 'ui.log';
var MONITOR_LOG = 'monitor.log';
var RUN_LOG = 'run.log';
var STATUS_FILE = 'status.json';
var ID_FILE = 'last-run';
var CONTROL_SOCKET = 'control.sock';
var LOG_SOCKET = 'log.sock';
var READY_RESPONSE = 'ready';

module.exports = {
  WORKING_DIR: WORKING_DIR,
  JOBS_DIR: JOBS_DIR,
  UI_LOG: UI_LOG,
  MONITOR_LOG: MONITOR_LOG,
  RUN_LOG: RUN_LOG,
  STATUS_FILE: STATUS_FILE,
  ID_FILE: ID_FILE,
  CONTROL_SOCKET: CONTROL_SOCKET,
  LOG_SOCKET: LOG_SOCKET,
  READY_RESPONSE: READY_RESPONSE
};