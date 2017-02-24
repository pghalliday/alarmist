'use strict';

var WORKING_DIR = '.alarmist';
var UI_LOG = 'ui.log';
var STDOUT_LOG = 'stdout.log';
var STDERR_LOG = 'stderr.log';
var ALL_LOG = 'all.log';
var STATUS_FILE = 'status.json';
var ID_FILE = 'id';
var CONTROL_SOCKET = 'control.sock';
var LOG_SOCKET = 'log.sock';
var READY_RESPONSE = 'ready';

module.exports = {
  WORKING_DIR: WORKING_DIR,
  UI_LOG: UI_LOG,
  STDOUT_LOG: STDOUT_LOG,
  STDERR_LOG: STDERR_LOG,
  ALL_LOG: ALL_LOG,
  STATUS_FILE: STATUS_FILE,
  ID_FILE: ID_FILE,
  CONTROL_SOCKET: CONTROL_SOCKET,
  LOG_SOCKET: LOG_SOCKET,
  READY_RESPONSE: READY_RESPONSE
};