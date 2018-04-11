import {
  handleActions,
  createActions,
} from 'redux-actions';
import {
  createSelector,
} from 'reselect';
import appendBuffer from '../../../../utils/append-buffer';

export const {
  taskStart,
  taskLog,
  taskEnd,
} = createActions(
  'TASK_START',
  'TASK_LOG',
  'TASK_END',
);

const EMPTY_BUFFER = Buffer.alloc(0);
const MAX_LOG_SIZE = 100000;

const initialState = (name) => ({
  name,
  id: 0,
  running: false,
  log: EMPTY_BUFFER,
  error: undefined,
});

const gt = (a, b) => a > b;
const eq = (a, b) => a === b;
function check(op, state, payload, callback) {
  if (payload.name === state.name && op(payload.id, state.id)) {
    return callback(state, payload);
  } else {
    return state;
  }
}

function headerText(name, id, message) {
  return `${name}: run ${id}: ${message}`;
}

const idSelector = (state) => state.id;
const nameSelector = (state) => state.name;
const runningSelector = (state) => state.running;
const errorSelector = (state) => state.error;
export const headerSelector = createSelector(
  nameSelector,
  idSelector,
  runningSelector,
  errorSelector,
  (name, id, running, error) => {
    if (running) {
      return {
        text: headerText(name, id, 'running'),
        bgcolor: 'yellow',
      };
    }
    if (error) {
      return {
        text: headerText(name, id, error),
        bgcolor: 'red',
      };
    }
    return {
      text: headerText(name, id, 'ok'),
      bgcolor: 'green',
    };
  },
);
export const logSelector = (state) => state.log;

export default function createReducer(name) {
  return handleActions({
    [taskStart]: (state, {payload}) => check(gt, state, payload, () => {
      return Object.assign({}, state, {
        id: payload.id,
        log: EMPTY_BUFFER,
        running: true,
        error: undefined,
      });
    }),
    [taskLog]: (state, {payload}) => check(eq, state, payload, () => {
      return Object.assign({}, state, {
        log: appendBuffer(MAX_LOG_SIZE, state.log, payload.data),
      });
    }),
    [taskEnd]: (state, {payload}) => check(eq, state, payload, () => {
      return Object.assign({}, state, {
        running: false,
        error: payload.error,
      });
    }),
  }, initialState(name));
}
