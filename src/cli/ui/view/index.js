import _ from 'lodash';
import blessed from 'blessed';
import {createLayout} from './layout';
import {createMonitor} from './monitor';
import {createJobs} from './jobs';

// istanbul ignore next
function createView(store) {
  const screen = blessed.screen({
    smartCSR: true,
  });
  screen.title = 'alarmist';
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  const layout = createLayout(screen);
  const monitor = createMonitor(layout);
  const jobs = createJobs(layout);
  const update = () => {
    const state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply();
    screen.render();
  };
  store.subscribe(update);
  update();
}

export {createView};
