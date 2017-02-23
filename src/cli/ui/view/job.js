import _ from 'lodash';
import {
  jobLabel,
} from '../helpers';
import {
  WORKING_DIR,
  ALL_LOG,
} from '../../../constants';
import {createEntry} from './entry';
import path from 'path';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : status.exitCode}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');

function createJob(name, layout) {
  const entry = createEntry(jobLabel(name), layout);
  let id;
  return {
    update: (status) => {
      const newId = status.id;
      if (newId !== id) {
        id = newId;
        entry.setLog(path.join(
          WORKING_DIR,
          name,
          '' + id,
          ALL_LOG,
        ));
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
