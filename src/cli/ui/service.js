import _ from 'lodash';
import {
  exit,
  start,
  end,
  monitorLog,
  jobLog,
} from './redux/actions';

export function createService(monitor, store) {
  const onExit = (code) => {
    store.dispatch(exit(code));
  };
  const onStart = (status) => {
    store.dispatch(start(status));
  };
  const onEnd = (status) => {
    store.dispatch(end(status));
  };
  const onJobLog = (logData) => {
    store.dispatch(jobLog(logData));
  };
  const onMonitorLog = (data) => {
    store.dispatch(monitorLog(data));
  };
  monitor.on('exit', onExit);
  monitor.on('start', onStart);
  monitor.on('end', onEnd);
  monitor.on('log', onJobLog);
  monitor.stdout.on('data', onMonitorLog);
  monitor.stderr.on('data', onMonitorLog);
  return {
    stop: () => {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('start', onStart);
      monitor.removeListener('end', onEnd);
      monitor.removeListener('log', onJobLog);
      monitor.stdout.removeListener('data', onMonitorLog);
      monitor.stderr.removeListener('data', onMonitorLog);
    },
  };
}
