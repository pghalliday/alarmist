import _ from 'lodash';
import blessed from 'blessed';
import {
  TEXT_PROPERTIES,
} from './constants';
import {
  MONITOR_LABEL,
} from '../constants';

export function createMonitor(layout) {
  const element = blessed.text(_.cloneDeep(TEXT_PROPERTIES));
  layout.append(MONITOR_LABEL, element);
  return {
    update: (state) => {
      if (_.isUndefined(state.exitCode)) {
        element.content = ' monitor: ok';
        element.style.bg = 'green';
      } else {
        element.content = ` monitor: exited: ${state.exitCode}`;
        element.style.bg = 'red';
      }
    },
  };
}
