import _ from 'lodash';
import {
  exit,
  update,
} from './redux/actions';

export function createService(monitor, store) {
  const jobLogSubs = {};
  const monitorLogSubs = [];
  const onExit = (code) => {
    store.dispatch(exit(code));
  };
  const onUpdate = (status) => {
    store.dispatch(update(status));
  };
  const onJobLog = (logData) => {
    const nameSubs = jobLogSubs[logData.name];
    if (nameSubs) {
      const idSubs = nameSubs[logData.id];
      if (idSubs) {
        for (let callback of idSubs) {
          callback(logData.data);
        }
      }
    }
  };
  const onMonitorLog = (data) => {
    for (let callback of monitorLogSubs) {
      callback(data);
    }
  };
  monitor.on('exit', onExit);
  monitor.on('update', onUpdate);
  monitor.on('log', onJobLog);
  monitor.stdout.on('data', onMonitorLog);
  monitor.stderr.on('data', onMonitorLog);
  return {
    stop: () => {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('update', onUpdate);
      monitor.removeListener('log', onJobLog);
      monitor.stdout.removeListener('data', onMonitorLog);
      monitor.stderr.removeListener('data', onMonitorLog);
    },
    subscribeMonitorLog: (callback) => {
      monitorLogSubs.push(callback);
      return () => {
        _.pull(monitorLogSubs, callback);
      };
    },
    subscribeJobLog: (name, id, callback) => {
      const nameSubs = jobLogSubs[name] = jobLogSubs[name] || {};
      const idSubs = nameSubs[id] = nameSubs[id] || [];
      idSubs.push(callback);
      return () => {
        _.pull(idSubs, callback);
        // istanbul ignore else
        if (idSubs.length === 0) {
          delete nameSubs[id];
          // istanbul ignore else
          if (Object.keys(nameSubs).length === 0) {
            delete jobLogSubs[name];
          }
        }
      };
    },
  };
}
