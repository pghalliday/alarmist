import _ from 'lodash';
import path from 'path';
import blessed from 'blessed';
import Layout from './layout';
import Monitor from './monitor';
import Jobs from './jobs';
import Job from './job';
import Metric from './metric';
import Table from './table';
import Service from './service';
import logger from './logger';
import {
  UI_LOG,
} from '../../../../constants';
import {
  resize,
  select,
  up,
  down,
  moveUp,
  moveDown,
  toggleExpanded,
} from '../redux/actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  CONTAINER_PROPERTIES,
} from './constants';

// istanbul ignore next
function createView(service, store, workingDir, debug) {
  const screen = blessed.screen({
    smartCSR: true,
    log: path.join(workingDir, UI_LOG),
    debug,
  });
  logger.log = screen.log.bind(screen);
  logger.debug = screen.debug.bind(screen);
  logger.log('created');
  screen.title = 'alarmist';
  screen.on('keypress', (...args) => {
    logger.debug(args);
  });
  screen.on('mouse', (...args) => {
    logger.debug(args);
  });
  screen.key(['C-c'], async () => {
    await service.stop();
    process.exit(0);
  });
  screen.key(['enter', 'o'], () => store.dispatch(toggleExpanded()));
  const container = blessed.box(CONTAINER_PROPERTIES);
  screen.key(['C-up', 'C-k'], () => {
    container.focus();
    store.dispatch(moveUp());
  });
  screen.key(['C-down', 'C-j', 'linefeed'], () => {
    container.focus();
    store.dispatch(moveDown());
  });
  screen.key(['S-up', 'S-k'], () => {
    container.focus();
    store.dispatch(up());
  });
  screen.key(['S-down', 'S-j'], () => {
    container.focus();
    store.dispatch(down());
  });
  screen.append(container);
  container.key(['up', 'k'], () => store.dispatch(up()));
  container.key(['down', 'j'], () => store.dispatch(down()));
  const layout = new Layout(container);
  layout.on('select', (label) => {
    store.dispatch(select(label));
  });
  layout.on('toggleExpanded', () => {
    store.dispatch(toggleExpanded());
  });
  const monitor = new Monitor();
  layout.append(MONITOR_LABEL, monitor);
  const jobs = new Jobs({Job, Metric, Table, Service, layout});
  const update = _.throttle(() => {
    const state = store.getState();
    monitor.update(state.monitor);
    jobs.update(state.jobs);
    layout.apply(state.layout);
    screen.render();
  });
  screen.on('resize', () => {
    logger.log('resize');
    logger.debug('width: ' + screen.width);
    logger.debug('height: ' + screen.height);
    store.dispatch(resize({
      width: screen.width,
      height: screen.height,
    }));
  });
  store.subscribe(update);
  update();
}

export {createView};
