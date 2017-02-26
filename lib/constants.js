'use strict';

var WORKING_DIR = '.alarmist';
var BLESSED_LOG = 'blessed.log';
var PROCESS_LOG = 'process.log';
var STATUS_FILE = 'status.json';
var ID_FILE = 'id';
var CONTROL_SOCKET = 'control.sock';
var LOG_SOCKET = 'log.sock';
var READY_RESPONSE = 'ready';

module.exports = {
  WORKING_DIR: WORKING_DIR,
  BLESSED_LOG: BLESSED_LOG,
  PROCESS_LOG: PROCESS_LOG,
  STATUS_FILE: STATUS_FILE,
  ID_FILE: ID_FILE,
  CONTROL_SOCKET: CONTROL_SOCKET,
  LOG_SOCKET: LOG_SOCKET,
  READY_RESPONSE: READY_RESPONSE
};