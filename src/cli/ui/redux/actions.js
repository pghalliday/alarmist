import {createActions} from 'redux-actions';

module.exports = createActions(
  'RESET',
  'START',
  'END',
  'EXIT',
  'UP',
  'DOWN',
  'TOGGLE_EXPANDED',
  'MONITOR_LOG',
  'JOB_LOG',
);
