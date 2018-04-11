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
  serviceStart,
  serviceLog,
  serviceEnd,
} = createActions(
  'SERVICE_START',
  'SERVICE_LOG',
  'SERVICE_END',
);

function headerText(name, message) {
  return `${name}: ${message}`;
}

export default function createReducer(name, type) {
  const nameSelector = (state) => state.name;
  const runningSelector = (state) => state.running;
  const errorSelector = (state) => state.error;
  const headerSelector = createSelector(
    nameSelector,
    runningSelector,
    errorSelector,
    (name, running, error) => {
      if (running) {
        return {
          text: headerText(name, 'ok'),
          bgcolor: 'green',
          fgcolor: 'black',
        };
      }
      if (error) {
        return {
          text: headerText(name, `exited: ${error}`),
          bgcolor: 'red',
          fgcolor: 'black',
        };
      }
      return {
        text: headerText(name, 'exited'),
        bgcolor: 'red',
        fgcolor: 'black',
      };
    },
  );
  const logSelector = (state) => state.log;
  return createCommonReducer({
    name,
    type,
    start: serviceStart,
    log: serviceLog,
    end: serviceEnd,
    headerSelector,
    logSelector,
  });
}
