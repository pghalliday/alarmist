import _ from 'lodash';
import {createEntry} from './entry';
import {
  MONITOR_LABEL,
} from '../constants';

export function createMonitor(service, layout) {
  const entry = createEntry(MONITOR_LABEL, layout);
  entry.clear();
  service.subscribeMonitorLog((data) => {
    entry.log(data);
  });
  return {
    update: (state) => {
      if (_.isUndefined(state.exitCode)) {
        entry.setHeader(
          ' monitor: ok',
          'green',
        );
      } else {
        entry.setHeader(
          ` monitor: exited: ${state.exitCode}`,
          'red',
        );
      }
    },
  };
}
