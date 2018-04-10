import {createActions} from 'redux-actions';

module.exports = createActions(
  'RESET',
  'START',
  'SELECT',
  'UP',
  'DOWN',
  'MOVE_UP',
  'MOVE_DOWN',
  'TOGGLE_EXPANDED',
  'RESIZE',
);
