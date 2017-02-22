import {
  exit,
  update,
} from './redux/actions';

export function createService(monitor, store) {
  const onExit = (code) => {
    store.dispatch(exit(code));
  };
  const onUpdate = (status) => {
    store.dispatch(update(status));
  };
  monitor.on('exit', onExit);
  monitor.on('update', onUpdate);
  return {
    stop: () => {
      monitor.removeListener('exit', onExit);
      monitor.removeListener('update', onUpdate);
    },
  };
}
