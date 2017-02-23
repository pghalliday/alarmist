import _ from 'lodash';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  exit,
  update,
} from './actions';

const initialMonitor = {};

const monitor= handleActions({
  [reset]: () => initialMonitor,
  [exit]: (monitor, {payload}) => ({exitCode: payload}),
}, initialMonitor);

const initialJobs = {};

const jobs = handleActions({
  [reset]: () => initialJobs,
  [update]: (jobs, {payload}) => {
    const name = payload.name;
    const existing = jobs[name];
    if (!_.isUndefined(existing) && existing.id > payload.id) {
      return jobs;
    }
    return Object.assign({}, jobs, {
      [name]: payload,
    });
  },
}, initialJobs);

export default combineReducers({
  monitor,
  jobs,
});
