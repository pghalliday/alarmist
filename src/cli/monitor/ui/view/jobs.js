import _ from 'lodash';
import {jobLabel} from '../helpers';

export default class Jobs {
  constructor(Job, Metric, layout) {
    this.Job = Job;
    this.Metric = Metric;
    this.layout = layout;
    this.jobs = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.jobs[name];
      if (_.isUndefined(existing)) {
        const job = status.metric ? new this.Metric() : new this.Job();
        this.jobs[name] = {
          job: job,
          status: status,
        };
        this.layout.append(jobLabel(name), job);
        job.update(status);
      } else {
        if (status !== existing.status) {
          existing.job.update(status);
        }
      }
    });
  }
}
