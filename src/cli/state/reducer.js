import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {
  reset,
  updateJob,
} from './actions';

const initialJobs = [];

export default handleActions({
  [reset]: () => initialJobs,
  [updateJob]: (jobs, {payload}) => {
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
