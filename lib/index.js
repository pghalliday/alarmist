'use strict';

var _job = require('./alarmist/job');

var _monitor = require('./alarmist/monitor');

var _jobExec = require('./alarmist/job-exec');

var _monitorExec = require('./alarmist/monitor-exec');

module.exports = {
  createJob: _job.createJob,
  createMonitor: _monitor.createMonitor,
  execJob: _jobExec.exec,
  execMonitor: _monitorExec.exec
};