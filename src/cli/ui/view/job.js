import _ from 'lodash';
import blessed from 'blessed';
import {
  TEXT_PROPERTIES,
} from './constants';

// eslint-disable-next-line max-len
const jobContent = (status) => ` ${status.name}: ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : status.exitCode}`;
// eslint-disable-next-line max-len
const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');

function createJob(layout) {
  const element = blessed.text(TEXT_PROPERTIES);
  layout.append(element);
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
