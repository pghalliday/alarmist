import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {
  reset,
  startJob,
  completeJob,
} from './actions';

const initialJobs = [];

export default handleActions({
  [reset]: () => initialJobs,
  [startJob]: (jobs, {payload}) => {
    const index = _.findIndex(jobs, {name: payload.name});
    if (index !== -1) {
      const existingJob = jobs[index];
      if (existingJob.startTime > payload.startTime) {
        return jobs;
      }
      return _.concat(
        jobs.slice(0, index),
        _.create(payload, {
          selected: existingJob.selected,
          expanded: existingJob.expanded,
        }),
        jobs.slice(index + 1),
      );
    }
    const selected = (jobs.length === 0);
    return _.concat(
      jobs,
      _.create(payload, {
        selected: selected,
        expanded: false,
      }),
    );
  },
  [completeJob]: (jobs, {payload}) => {
    const index = _.findIndex(jobs, {name: payload.name});
    if (index !== -1) {
      const existingJob = jobs[index];
      if (existingJob.startTime > payload.startTime) {
        return jobs;
      }
      return _.concat(
        jobs.slice(0, index),
        _.create(payload, {
          selected: existingJob.selected,
          expanded: existingJob.expanded,
        }),
        jobs.slice(index + 1),
      );
    }
    const selected = (jobs.length === 0);
    return _.concat(
      jobs,
      _.create(payload, {
        selected: selected,
        expanded: false,
      }),
    );
  },
}, initialJobs);
