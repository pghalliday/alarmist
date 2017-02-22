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

const initialJobs = [];

const jobs = handleActions({
  [reset]: () => initialJobs,
  [update]: (jobs, {payload}) => {
    const index = _.findIndex(jobs, {name: payload.name});
    if (index !== -1) {
      const existingJob = jobs[index];
      if (existingJob.id > payload.id) {
        return jobs;
      }
      return _.concat(
        jobs.slice(0, index),
        Object.assign({}, payload),
        jobs.slice(index + 1),
      );
    }
    return _.concat(
      jobs,
      Object.assign({}, payload),
    );
  },
}, initialJobs);

export default combineReducers({
  monitor,
  jobs,
});
