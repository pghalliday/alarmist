import {createActions} from 'redux-actions';

module.exports = createActions({
  RESET: () => undefined,
  START: (status) => status,
  END: (status) => status,
  EXIT: (code) => code,
  UP: () => undefined,
  DOWN: () => undefined,
  TOGGLE_EXPANDED: () => undefined,
  MONITOR_LOG: (data) => data,
  JOB_LOG: (logData) => logData,
});
