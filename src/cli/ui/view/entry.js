import _ from 'lodash';
import blessed from 'blessed';
import {
  HEADER_PROPERTIES,
  LOG_PROPERTIES,
} from './constants';

function createEntry(label, layout) {
  const header = blessed.text(_.cloneDeep(HEADER_PROPERTIES));
  const log = blessed.log(_.cloneDeep(LOG_PROPERTIES));
  layout.append(label, header, log);
  return {
    setHeader: (content, color) => {
      header.content = content;
      header.style.bg = color;
    },
    log: (data) => {
      log.log(data.toString());
    },
    clear: () => {
      log.content = '';
    },
  };
}

module.exports = {
  createEntry,
};
