import _ from 'lodash';
import {jobLabel} from '../helpers';

export default class Jobs {
  constructor(Job, layout) {
    this.Job = Job;
    this.layout = layout;
    this.jobs = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.jobs[name];
      if (_.isUndefined(existing)) {
        const job = new this.Job();
        this.jobs[name] = {
          job: job,
          status: status,
        };
        job.update(status);
        this.layout.append(jobLabel(name), job);
      } else {
        if (status !== existing.status) {
          existing.job.update(status);
        }
      }
    });
  }
}
