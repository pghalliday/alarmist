import _ from 'lodash';
import {
  end,
  log,
} from '../redux/actions';

export function createService({monitor, store, types}) {
  const createRunAction = (name) => (status) => {
    const type = types[status.type];
    if (type) {
      type.service[name](status);
    } else {
      // TODO: log unknown type error
    }
  };

  const onEnd = (code) => {
    store.dispatch(end(code));
  };
  const onRunStart = createRunAction('start');
  const onRunEnd = createRunAction('end');
  const onRunLog = createRunAction('log');
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
