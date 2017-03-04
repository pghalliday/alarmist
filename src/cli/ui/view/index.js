import _ from 'lodash';
import path from 'path';
import blessed from 'blessed';
import Layout from './layout';
import Monitor from './monitor';
import Jobs from './jobs';
import Job from './job';
import logger from './logger';
import {
  WORKING_DIR,
  UI_LOG,
} from '../../../constants';
import {
  up,
  down,
  toggleExpanded,
} from '../redux/actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  CONTAINER_PROPERTIES,
} from './constants';

// istanbul ignore next
function createView(service, store) {
  const screen = blessed.screen({
    smartCSR: true,
    log: path.join(WORKING_DIR, UI_LOG),
    debug: false,
  });
  logger.log = screen.log.bind(screen);
  logger.debug = screen.debug.bind(screen);
  logger.log('created');
  screen.title = 'alarmist';
  screen.key(['C-c'], async () => {
    await service.stop();
    process.exit(0);
  });
  screen.key(['enter', 'o'], () => store.dispatch(toggleExpanded()));
  const container = blessed.box(CONTAINER_PROPERTIES);
  screen.on('keypress', (ch, key) => {
    logger.debug(key);
  });
  screen.key(['S-k'], () => {
    container.focus();
    store.dispatch(up());
  });
  screen.key(['S-j'], () => {
    container.focus();
    store.dispatch(down());
  });
  screen.append(container);
  container.key(['up', 'k'], () => store.dispatch(up()));
  container.key(['down', 'j'], () => store.dispatch(down()));
  const layout = new Layout(container);
  const monitor = new Monitor();
  layout.append(MONITOR_LABEL, monitor);
  const jobs = new Jobs(Job, layout);
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
