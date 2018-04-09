import {createStore as reduxCreateStore} from 'redux';
import {createReducer} from './reducer';

export function createStore(types) {
  return reduxCreateStore(createReducer(types));
}
