import _ from 'lodash';
import {Tail} from 'tail';
import blessed from 'blessed';
import {
  HEADER_PROPERTIES,
  LOG_PROPERTIES,
  TAIL_OPTIONS,
} from './constants';

function createEntry(label, layout) {
  const header = blessed.text(_.cloneDeep(HEADER_PROPERTIES));
  const log = blessed.log(_.cloneDeep(LOG_PROPERTIES));
  let tail;
  const onLine = (data) => {
    log.log(data);
    log.render();
  };
  layout.append(label, header, log);
  return {
    setHeader: (content, color) => {
      header.content = content;
      header.style.bg = color;
    },
    setLog: (logFilePath) => {
      if(!_.isUndefined(tail)) {
        tail.unwatch();
        tail.removeListener('line', onLine);
      }
      log.content = '';
      tail = new Tail(logFilePath, TAIL_OPTIONS);
      tail.on('line', onLine);
    },
  };
}

module.exports = {
  createEntry,
};
