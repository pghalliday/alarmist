import _ from 'lodash';
import {
  end,
  runStart,
  runEnd,
  runLog,
  log,
} from './redux/actions';

export function createService(monitor, store) {
  const onEnd = (code) => {
    store.dispatch(end(code));
  };
  const onRunStart = (status) => {
    store.dispatch(runStart(status));
  };
  const onRunEnd = (status) => {
    store.dispatch(runEnd(status));
  };
  const onRunLog = (logData) => {
    store.dispatch(runLog(logData));
  };
  const onLog = (data) => {
    store.dispatch(log(data));
  };
  monitor.on('end', onEnd);
  monitor.on('run-start', onRunStart);
  monitor.on('run-end', onRunEnd);
  monitor.on('run-log', onRunLog);
  monitor.log.on('data', onLog);
  return {
    stop: async () => {
      monitor.removeListener('end', onEnd);
      monitor.removeListener('run-start', onRunStart);
      monitor.removeListener('run-end', onRunEnd);
      monitor.removeListener('run-log', onRunLog);
      monitor.log.removeListener('data', onLog);
      await monitor.close();
    },
  };
}
