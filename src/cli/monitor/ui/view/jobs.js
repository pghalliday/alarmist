import _ from 'lodash';
import {jobLabel} from '../helpers';

export default class Jobs {
  constructor(Job, Metric, Table, layout) {
    this.Job = Job;
    this.Metric = Metric;
    this.Table = Table;
    this.layout = layout;
    this.jobs = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.jobs[name];
      if (_.isUndefined(existing)) {
        let JobClass = this.Job;
        if (status.table) {
          JobClass = this.Table;
        } else if (status.metric) {
          JobClass = this.Metric;
        }
        const job = new JobClass();
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
