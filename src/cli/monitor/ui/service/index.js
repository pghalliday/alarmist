import _ from 'lodash';

export function createService({monitor, store, types}) {
  types = _.mapValues(types, (type) => {
    return type.createService(store);
  });

  const createAction = (name) => (status) => {
    const type = types[status.type];
    if (type) {
      type[name](status);
    } else {
      // TODO: log unknown type error
    }
  };

  const onStart = createAction('start');
  const onEnd = createAction('end');
  const onLog = createAction('log');

  monitor.on('start', onStart);
  monitor.on('end', onEnd);
  monitor.on('log', onLog);
  return {
    stop: async () => {
      monitor.removeListener('start', onStart);
      monitor.removeListener('end', onEnd);
      monitor.removeListener('log', onLog);
      await monitor.close();
    },
  };
}
