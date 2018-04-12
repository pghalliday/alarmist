import _ from 'lodash';
import logger from '../logger';

export function createService({monitor, store, types}) {
  types = _.mapValues(types, (type) => {
    return type.createService(store);
  });

  const createAction = (name) => (status) => {
    logger.debug(status);
    const type = types[status.type];
    // istanbul ignore else
    if (type) {
      type[name](status);
    } else {
      logger.log(`No service available for this type of entry: ${type}`);
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
    },
  };
}
