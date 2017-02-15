import {createJob} from './alarmist/job';
import {createMonitor} from './alarmist/monitor';
import {exec as execJob} from './alarmist/job-exec';
import {exec as execMonitor} from './alarmist/monitor-exec';

module.exports = {
  createJob,
  createMonitor,
  execJob,
  execMonitor,
};
