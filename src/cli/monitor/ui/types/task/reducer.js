import {handleActions} from 'redux-actions';
import {
  taskStart,
  taskLog,
  taskEnd,
} from './actions';

const initialState = {
};

export default function createReducer(name) {
  return handleActions({
    [taskStart]: (state, payload) => {
      if (payload.name === name) {
      }
    },
    [taskLog]: (state, payload) => {
      if (payload.name === name) {
      }
    },
    [taskEnd]: (state, payload) => {
      if (payload.name === name) {
      }
    },
  }, initialState);
}
