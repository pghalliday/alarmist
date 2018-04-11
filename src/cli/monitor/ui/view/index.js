import _ from 'lodash';
import blessed from 'blessed';
import Layout from './layout';
import Entries from './entries';
import logger from '../../logger';
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
  CONTAINER_PROPERTIES,
} from './constants';

// istanbul ignore next
function createView({screen, service, store, types}) {
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
  const entries = new Entries({types, layout});
  const update = _.throttle(() => {
    const state = store.getState();
    entries.update(state.entries);
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
