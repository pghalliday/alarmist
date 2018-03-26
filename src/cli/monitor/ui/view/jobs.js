import _ from 'lodash';
import {jobLabel} from '../helpers';
import {
  TYPE_JOB,
  TYPE_TABLE,
  TYPE_METRIC,
  TYPE_SERVICE,
} from '../constants';

export default class Jobs {
  constructor({
    Job,
    Metric,
    Table,
    Service,
    layout,
  }) {
    this.classes = {};
    this.classes[TYPE_JOB] = Job;
    this.classes[TYPE_TABLE] = Table;
    this.classes[TYPE_METRIC] = Metric;
    this.classes[TYPE_SERVICE] = Service;
    this.layout = layout;
    this.jobs = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.jobs[name];
      if (_.isUndefined(existing)) {
        let JobClass = this.classes[status.type];
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
