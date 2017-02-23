import _ from 'lodash';
import {createJob} from './job';

export function createJobs(layout) {
  const jobs = {};
  return {
    update: (state) => {
      for (let status of state) {
        const existing = jobs[status.name];
        if (_.isUndefined(existing)) {
          const job = createJob(layout);
          jobs[status.name] = {
            job: job,
            status: status,
          };
          job.update(status);
        } else {
          if (status !== existing.status) {
            existing.job.update(status);
          }
        }
      }
    },
  };
}
