import _ from 'lodash';
import blessed from 'blessed';
import {
  TEXT_PROPERTIES,
} from './constants';
import {
  jobLabel,
} from '../helpers';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : status.exitCode}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');

function createJob(name, layout) {
  const element = blessed.text(_.cloneDeep(TEXT_PROPERTIES));
  layout.append(jobLabel(name), element);
  return {
    update: (status) => {
      element.content = jobContent(status);
      element.style.bg = jobBg(status);
    },
  };
}

module.exports = {
  createJob,
};
