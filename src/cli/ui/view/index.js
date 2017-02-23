import _ from 'lodash';
import path from 'path';
import blessed from 'blessed';
import {createLayout} from './layout';
import {createMonitor} from './monitor';
import {createJobs} from './jobs';
import {
  WORKING_DIR,
  UI_LOG,
} from '../../../constants';
import {
  up,
  down,
} from '../redux/actions';

// istanbul ignore next
function createView(store) {
  const screen = blessed.screen({
    smartCSR: true,
    log: path.join(WORKING_DIR, UI_LOG),
  });
  screen.log('created');
  screen.title = 'alarmist';
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key(['up', 'k'], () => store.dispatch(up()));
  screen.key(['down', 'j'], () => store.dispatch(down()));
  const layout = createLayout(screen);
  const monitor = createMonitor(layout);
  const jobs = createJobs(layout);
  const update = () => {
    const state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply(state.layout);
    screen.render();
  };
  store.subscribe(update);
  update();
}

export {createView};
