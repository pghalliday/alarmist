import _ from 'lodash';
import {createEntry} from './entry';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  WORKING_DIR,
  ALL_LOG,
} from '../../../constants';
import path from 'path';

export function createMonitor(layout) {
  const entry = createEntry(MONITOR_LABEL, layout);
  entry.setLog(path.join(WORKING_DIR, ALL_LOG));
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
