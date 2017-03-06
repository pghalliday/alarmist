import {createActions} from 'redux-actions';

module.exports = createActions(
  'RESET',
  'RUN_START',
  'RUN_END',
  'END',
  'UP',
  'DOWN',
  'TOGGLE_EXPANDED',
  'LOG',
  'RUN_LOG',
);
