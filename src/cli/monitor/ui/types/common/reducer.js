import {
  handleActions,
} from 'redux-actions';
import appendBuffer from '../../../../utils/append-buffer';

const EMPTY_BUFFER = Buffer.alloc(0);
const MAX_LOG_SIZE = 100000;

const gt = (a, b) => a > b;
const eq = (a, b) => a === b;
function check(op, state, payload, callback) {
  if (payload.name === state.name && op(payload.id, state.id)) {
    return callback(state, payload);
  } else {
    return state;
  }
}

export function createReducer({
  name,
  type,
  start,
  log,
  end,
  headerSelector,
  logSelector,
}) {
  const INITIAL_STATE = {
    name,
    type,
    id: 0,
    running: false,
    log: EMPTY_BUFFER,
    error: undefined,
    selectors: {
      header: headerSelector,
      log: logSelector,
    },
  };
  return handleActions({
    [start]: (state, {payload}) => check(gt, state, payload, () => {
      return Object.assign({}, state, {
        id: payload.id,
        log: EMPTY_BUFFER,
        running: true,
        error: undefined,
      });
    }),
    [log]: (state, {payload}) => check(eq, state, payload, () => {
      return Object.assign({}, state, {
        log: appendBuffer(MAX_LOG_SIZE, state.log, payload.data),
      });
    }),
    [end]: (state, {payload}) => check(eq, state, payload, () => {
      return Object.assign({}, state, {
        running: false,
        error: payload.error,
      });
    }),
  }, INITIAL_STATE);
}
