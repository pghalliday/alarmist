import {createActions} from 'redux-actions';

module.exports = createActions(
  'RESET',
  'RUN_START',
  'RUN_END',
  'END',
  'SELECT',
  'UP',
  'DOWN',
  'MOVE_UP',
  'MOVE_DOWN',
  'TOGGLE_EXPANDED',
  'LOG',
  'RUN_LOG',
  'RESIZE',
);
