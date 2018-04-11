import {
  createActions,
} from 'redux-actions';
import {
  createSelector,
} from 'reselect';
import {
  createReducer as createCommonReducer,
} from '../common/reducer';

export const {
  taskStart,
  taskLog,
  taskEnd,
} = createActions(
  'TASK_START',
  'TASK_LOG',
  'TASK_END',
);

function headerText(name, id, message) {
  return `${name}: run ${id}: ${message}`;
}

export default function createReducer(name, type) {
  const idSelector = (state) => state.id;
  const nameSelector = (state) => state.name;
  const runningSelector = (state) => state.running;
  const errorSelector = (state) => state.error;
  const headerSelector = createSelector(
    nameSelector,
    idSelector,
    runningSelector,
    errorSelector,
    (name, id, running, error) => {
      if (running) {
        return {
          text: headerText(name, id, 'running'),
          bgcolor: 'yellow',
          fgcolor: 'black',
        };
      }
      if (error) {
        return {
          text: headerText(name, id, error),
          bgcolor: 'red',
          fgcolor: 'black',
        };
      }
      return {
        text: headerText(name, id, 'ok'),
        bgcolor: 'green',
        fgcolor: 'black',
      };
    },
  );
  const logSelector = (state) => state.log;
  return createCommonReducer({
    name,
    type,
    start: taskStart,
    log: taskLog,
    end: taskEnd,
    headerSelector,
    logSelector,
  });
}
