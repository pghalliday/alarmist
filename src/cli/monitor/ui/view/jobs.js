import _ from 'lodash';
import {jobLabel} from '../helpers';

export default class Jobs {
  constructor({
    types,
    layout,
  }) {
    this.types = types;
    this.layout = layout;
    this.jobs = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.jobs[name];
      if (_.isUndefined(existing)) {
        const type = this.types[status.type];
        if (type) {
          const job = type.createView(name);
          this.jobs[name] = {
            job: job,
            status: status,
          };
          this.layout.append(jobLabel(name), job);
          job.update(status);
        } else {
          // TODO: log unknown type error
        }
      } else {
        if (status !== existing.status) {
          existing.job.update(status);
        }
      }
    });
  }
}
