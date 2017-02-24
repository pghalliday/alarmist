import _ from 'lodash';
import {
  jobLabel,
} from '../helpers';
import {createEntry} from './entry';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : status.exitCode}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');

function createJob(name, service, layout) {
  const entry = createEntry(jobLabel(name), layout);
  let id;
  let unsubscribe;
  return {
    update: (status) => {
      const newId = status.id;
      if (newId !== id) {
        id = newId;
        if (unsubscribe) {
          unsubscribe();
        }
        entry.clear();
        unsubscribe = service.subscribeJobLog(name, id, (data) => {
          entry.log(data);
        });
      }
      entry.setHeader(
        jobContent(status),
        jobBg(status),
      );
    },
  };
}

module.exports = {
  createJob,
};
