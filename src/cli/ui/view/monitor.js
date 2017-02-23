import _ from 'lodash';
import blessed from 'blessed';
import {
  TEXT_PROPERTIES,
} from './constants';

export function createMonitor(layout) {
  const element = blessed.text(TEXT_PROPERTIES);
  layout.append(element);
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
