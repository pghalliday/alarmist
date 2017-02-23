import {createActions} from 'redux-actions';

module.exports = createActions({
  RESET: () => undefined,
  UPDATE: (status) => status,
  EXIT: (code) => code,
  UP: () => undefined,
  DOWN: () => undefined,
});
